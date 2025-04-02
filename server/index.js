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

// Храним данные игроков
const players = {};
const MAX_PLAYERS = 3;
let ready = 0;

app.get('/api', (req, res) => {
    res.json({
        message: 'hello'
    });
});

socketIO.on('connection', (socket) => {
    // Проверяем, не превышен ли лимит игроков
    if (Object.keys(players).length >= MAX_PLAYERS) {
        socket.emit('server_full', 'Сервер заполнен. Максимум 2 игрока.');
        socket.disconnect();
        return;
    }

    // Ожидаем от клиента никнейм
    socket.on('set_username', (username) => {
        if (!username || typeof username !== 'string') {
            socket.emit('invalid_username', 'Никнейм должен быть строкой!');
            return;
        }

        // Проверяем, не занят ли никнейм
        const isNameTaken = Object.values(players).some(player => player.username === username);
        if (isNameTaken) {
            socket.emit('username_taken', 'Этот никнейм уже занят!');
            return;
        }

        // Добавляем игрока в список
        players[socket.id] = {
            id: socket.id,
            username: username,
            isReady: false,
            gameData: null
        };

        console.log(`Игрок ${username} (${socket.id}) подключился. Всего игроков: ${Object.keys(players).length}`);

        // Уведомляем всех о новом игроке
        socketIO.emit('players_update', ready);
    });

    // Обработчик получения игровых данных от клиента
    socket.on('submit_game_data', (data) => {
        if (!players[socket.id]) {
            socket.emit('error', 'Сначала укажите никнейм!');
            return;
        }

        if (!Array.isArray(data) || !data.every(row => Array.isArray(row))) {
            socket.emit('invalid_data', 'Ожидается двумерный массив!');
            return;
        }

        // Сохраняем данные игрока
        players[socket.id].gameData = data;
        players[socket.id].isReady = true;
        ready++;

        console.log(`Игрок ${players[socket.id].username} готов к игре!`);

        // Проверяем, готовы ли все игроки
        if (ready >= 3) {
            socketIO.emit('players_update', ready);
            console.log('Все игроки готовы! Начинаем игру.');
            socketIO.emit('all_players_ready', players);
        } else {
            socketIO.emit('players_update', ready);
        }
    });

    // Обработчик отключения игрока
    socket.on('disconnect', () => {
        if (players[socket.id]) {
            console.log(`Игрок ${players[socket.id].username} отключился. Осталось игрков : ${players.length}`);
            delete players[socket.id];
            socketIO.emit('players_update', players);
        }
    });
});

http.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});