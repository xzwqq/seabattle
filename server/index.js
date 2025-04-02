const express = require('express');
const app = express();
const PORT = 8080;

const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors:{
        origin: false
    }
})

app.get('api', (req, res) => {
	res.json({
		message: 'hello'
	});
});

socketIO.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`users disconnected ${socket.id}`)
    })
})

http.listen(PORT, () => {
	console.log('server working');
});
