const express = require('express');
const app = express();
const PORT = 8080;

const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});

// Хранение данных игры
const game = {
  players: {},
  currentPlayerIndex: 0,
  gameStarted: false,
  readyPlayers: 0,
  MAX_PLAYERS: 3
};

// Функция обновления состояния игры
function updateGameState() {
  const playerIds = Object.keys(game.players);
  const currentPlayerId = playerIds[game.currentPlayerIndex] || null;

  const gameState = {
    currentPlayer: currentPlayerId,
    players: {},
    gameStarted: game.gameStarted,
    readyCount: game.readyPlayers,
    MAX_PLAYERS: game.MAX_PLAYERS
  };

  playerIds.forEach(id => {
    gameState.players[id] = {
      id,
      nickname: game.players[id].username,
      field: game.players[id].gameData,
      isReady: game.players[id].isReady
    };
  });

  socketIO.emit('game_state_update', gameState);
  console.log('Game state updated');
}

// Проверка живых кораблей
function hasAliveShips(field) {
  return field.some(row => row.some(cell => cell === 1));
}

// Проверка окончания игры
function checkGameOver() {
  const alivePlayers = Object.values(game.players)
    .filter(player => hasAliveShips(player.gameData));

  if (alivePlayers.length === 1) {
    return {
      gameOver: true,
      winner: alivePlayers[0].id,
      winnerName: alivePlayers[0].username
    };
  }

  return { gameOver: false };
}

// Обработка подключений
socketIO.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  if (Object.keys(game.players).length >= game.MAX_PLAYERS) {
    socket.emit('server_full', `Достигнут лимит игроков (${game.MAX_PLAYERS})`);
    socket.disconnect();
    return;
  }

  socket.on('set_username', (username) => {
    if (!username || typeof username !== 'string') {
      socket.emit('error', 'Некорректное имя игрока');
      return;
    }

    const nameTaken = Object.values(game.players)
      .some(player => player.username === username);
    
    if (nameTaken) {
      socket.emit('error', 'Имя уже занято');
      return;
    }

    game.players[socket.id] = {
      id: socket.id,
      username,
      isReady: false,
      gameData: null
    };

    socket.emit('username_accepted');
    updateGameState();
  });

  socket.on('submit_game_data', (fieldData) => {
    if (!game.players[socket.id]) {
      socket.emit('error', 'Сначала установите имя');
      return;
    }

    if (!Array.isArray(fieldData) || fieldData.length !== 5 || 
        !fieldData.every(row => Array.isArray(row) && row.length === 7)) {
      socket.emit('error', 'Неверный формат данных поля');
      return;
    }

    game.players[socket.id].gameData = fieldData;
    game.players[socket.id].isReady = true;
    game.readyPlayers++;

    socket.emit('game_data_accepted');
    socketIO.emit('players_update', game.readyPlayers);

    if (game.readyPlayers >= game.MAX_PLAYERS) {
      game.gameStarted = true;
      game.currentPlayerIndex = Math.floor(Math.random() * game.MAX_PLAYERS);
      console.log('Игра началась!');
    }

    updateGameState();
  });

  socket.on('make_shot', ({ targetPlayerId, x, y }, callback) => {
    if (!game.gameStarted) {
      return callback({ error: 'Игра еще не началась' });
    }

    const currentPlayerId = Object.keys(game.players)[game.currentPlayerIndex];
    if (socket.id !== currentPlayerId) {
      return callback({ error: 'Сейчас не ваш ход' });
    }

    const targetPlayer = game.players[targetPlayerId];
    if (!targetPlayer) {
      return callback({ error: 'Целевой игрок не найден' });
    }

    if (x < 0 || x > 6 || y < 0 || y > 4) {
      return callback({ error: 'Неверные координаты' });
    }

    const targetField = targetPlayer.gameData;
    const cellValue = targetField[y][x];

    if (cellValue === 1) {
      targetField[y][x] = 2;
      const { gameOver, winner, winnerName } = checkGameOver();
      if (gameOver) {
        game.gameStarted = false;
        socketIO.emit('game_over', { winner, winnerName });
        return callback({ hit: true, gameOver: true });
      }
      return callback({ hit: true });
    } 
    else if (cellValue === 0) {
      targetField[y][x] = 3;
      game.currentPlayerIndex = (game.currentPlayerIndex + 1) % Object.keys(game.players).length;
      updateGameState();
      return callback({ hit: false });
    }
    else {
      return callback({ error: 'Сюда уже стреляли' });
    }
  });

  socket.on('disconnect', () => {
    if (game.players[socket.id]) {
      console.log(`Игрок ${game.players[socket.id].username} отключился`);
      
      if (game.players[socket.id].isReady) {
        game.readyPlayers--;
      }
      
      delete game.players[socket.id];
      
      const { gameOver, winner, winnerName } = checkGameOver();
      if (gameOver) {
        game.gameStarted = false;
        socketIO.emit('game_over', { winner, winnerName });
      }
      
      updateGameState();
      socketIO.emit('players_update', game.readyPlayers);
    }
  });
});

http.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});