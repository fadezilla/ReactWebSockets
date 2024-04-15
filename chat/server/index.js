const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow only GET and POST requests
  },
});

io.on('connection', (socket) => {
  console.log('User has connected');

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});