import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { client } from '../../../app/socket/socket';
import { GameActions } from '../model/gameSlice';
import './game.scss';

const BattleshipGame = () => {
  const dispatch = useDispatch();
  const { gameState, status, winner } = useSelector(state => state.game);
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  
  // Подписка на обновления игры
  useEffect(() => {
    if (!client) return;

    const onGameUpdate = (newState) => {
      dispatch(GameActions.updateGameState(newState));
    };

    const onGameOver = ({ winner, winnerName }) => {
      dispatch(GameActions.gameOver({ winner, winnerName }));
    };

    client.on('game_state_update', onGameUpdate);
    client.on('game_over', onGameOver);

    return () => {
      client.off('game_state_update', onGameUpdate);
      client.off('game_over', onGameOver);
    };
  }, [dispatch]);

  // Обработчик выстрела
  const handleShoot = (x, y) => {
    if (!selectedEnemy || !client?.id) return;
    
    client.emit('make_shot', {
      targetPlayerId: selectedEnemy,
      x, y
    }, (response) => {
      if (response?.error) {
        console.error('Ошибка выстрела:', response.error);
      }
    });
  };

  // Получаем данные текущего игрока
  const myData = gameState?.players?.[client?.id] || {};
  const enemies = Object.entries(gameState?.players || {})
    .filter(([id]) => id !== client?.id)
    .map(([id, player]) => ({ id, ...player }));

  // Определение статуса игры
  const getGameStatus = () => {
    if (status === 'finished') {
		setTimeout(()=> window.location.href= '/', 5000)
      if (winner === client?.id) return 'Вы победили! через 5 секунд игра закончиться';
      if (winner) return `Победитель: ${gameState.players[winner]?.nickname} через 5 секунд игра закончиться`;
      return 'Ничья! через 5 секунд игра закончиться';
    }
    
    if (!gameState?.gameStarted) {
      return `Ожидание игроков (${gameState?.readyCount || 0}/${gameState?.MAX_PLAYERS || 3})`;
    }
    
    if (gameState.currentPlayer === client?.id) return 'Ваш ход!';
    
    const currentPlayer = gameState.players[gameState.currentPlayer];
    return `Ходит: ${currentPlayer?.nickname || 'противник'}`;
  };

  return (
    <div className="game-container">
      <h1>Морской бой</h1>
      <div className={`game-status ${status}`}>
        {getGameStatus()}
      </div>

      <div className="game-board">
        <div className="player-section">
          <h2>Ваше поле ({myData.nickname})</h2>
          <Battlefield 
            field={myData.field} 
            isMine={true}
          />
        </div>
        
        <div className="enemies-section">
          <h2>Противники</h2>
          {enemies.map(enemy => (
            <div 
              key={enemy.id}
              className={`enemy-field ${selectedEnemy === enemy.id ? 'selected' : ''}`}
              onClick={() => gameState.currentPlayer === client?.id && setSelectedEnemy(enemy.id)}
            >
              <h3>{enemy.nickname}</h3>
              <Battlefield 
                field={enemy.field}
                isMine={false}
                onCellClick={
                  gameState.currentPlayer === client?.id && selectedEnemy === enemy.id 
                    ? handleShoot 
                    : null
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Компонент игрового поля
const Battlefield = ({ field, isMine, onCellClick }) => {
  if (!field) return <div className="battlefield empty">Загрузка поля...</div>;

  return (
    <div className={`battlefield ${isMine ? 'my-field' : 'enemy-field'}`}>
      {field.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell, x) => (
            <div 
              key={x}
              className={`cell ${
                cell === 2 ? 'hit' : 
                cell === 3 ? 'miss' : ''
              } ${onCellClick ? 'clickable' : ''}`}
              onClick={() => onCellClick?.(x, y)}
            >
              {cell === 2 && '✖'}
              {cell === 3 && '○'}
              {isMine && cell === 1 && '■'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BattleshipGame;