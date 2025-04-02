import socketIO from 'socket.io-client'

export const client = socketIO('localhost:8080')