const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server, {
cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('set username', async ({ username, room }) => {
    socket.username = username; // Store username in socket object
    socket.join(room);
    console.log(`${username} joined room: ${room}`);
    const clients = await getClientsWithUsernames(room);
    io.to(room).emit('room clients', clients);
  });

  socket.on('message', ({ room, message }) => {
    console.log(`Sending message to room: ${room}`);
    io.to(room).emit('message', message);
  });

  socket.on('global message', (message) => {
    console.log('Sending global message:', message);
    io.emit('global message', message);
  });

  socket.on('disconnecting', async () => {
    const rooms = socket.rooms;
    rooms.forEach(async (room) => {
      if (room !== socket.id) {
        const clients = await getClientsWithUsernames(room);
        socket.to(room).emit('room clients', clients);
      }
    });
    console.log('User disconnected');
  });
});

async function getClientsWithUsernames(room) {
  const sockets = await io.in(room).fetchSockets();
  return sockets.map((socket) => ({
    id: socket.id,
    username: socket.username || 'Anonymous',
  }));
}

server.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});