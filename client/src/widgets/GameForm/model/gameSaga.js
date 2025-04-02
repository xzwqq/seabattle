import { call, put, take, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { GameActions } from './gameSlice';
import { client } from '../../../app/socket/socket';

// Создание канала для событий сокета
function createSocketChannel(socket, event) {
  return eventChannel(emit => {
    const handler = (data) => {
      emit(data);
    };

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  });
}

// Обработка обновлений состояния игры
function* watchGameUpdates() {
  const channel = yield call(createSocketChannel, client, 'game_state_update');
  while (true) {
    const gameState = yield take(channel);
    yield put(GameActions.updateGameState(gameState));
  }
}

// Обработка окончания игры
function* watchGameOver() {
  const channel = yield call(createSocketChannel, client, 'game_over');
  while (true) {
    const payload = yield take(channel);
    yield put(GameActions.gameOver(payload));
  }
}

// Главная сага
export function* watchGame() {
  yield fork(watchGameUpdates);
  yield fork(watchGameOver);
}