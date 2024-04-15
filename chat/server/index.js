const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server, {
  reconnectionAttempts: 5, //Max number of reconnection attempts
    reconnectinDelayMax: 5000, //Maximum delay between reconnections (MS)
    cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a room
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Listen for messages sent to the room
  socket.on('message', ({ room, message }) => {
    // Emit the message only to users in the same room
    console.log(`Sending message to room: ${room}`);
    console.log('Message:', message);
    io.to(room).emit('message', message);
  });

  socket.on('global message', (message) => {
    // Broadcast the message to all clients, including the sender
    console.log('Sending global message:', message);
    io.emit('global message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});