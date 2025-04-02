import { call, put, takeLatest, take, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { waitActions } from './waitSlices.js';
import { client } from '../../../app/socket/socket.js';

// Создаем канал для сокет-событий
function createSocketChannel(socket, eventName) {
  return eventChannel((emit) => {
    const handler = (data) => {
      emit(data); // Пробрасываем данные в сагу
    };

    socket.on(eventName, handler); // Подписываемся на событие

    // Функция отписки
    return () => {
      socket.off(eventName, handler); // Отписываемся
    };
  });
}

// Сага для отправки сообщения
function* postWaitSaga(action) {
  try {
    yield call([client, client.emit], "submit_game_data", action.payload);
  } catch (error) {
    console.error('Emit error:', error);
  }
}

// Сага для получения сообщений
function* getReadyUser() {
  const socketChannel = yield call(createSocketChannel, client, 'players_update'); // Используем client вместо socket

  while (true) {
    try {
      const message = yield take(socketChannel);
	  console.log(message)
      yield put(waitActions.setQueue(message));
    } catch (err) {
      console.error('Socket error:', err);
      // Можно добавить логику переподключения
    }
  }
}

// Вотчеры
export default function* watchWait() {
  yield fork(getReadyUser); // Запускаем в фоне, так как это слушатель
  yield takeLatest(waitActions.submitTable, postWaitSaga);
}