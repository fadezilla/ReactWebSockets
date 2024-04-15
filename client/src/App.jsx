import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:8080', {
  autoConnect: false, // Prevent immediate connection on page load
  reconnectionAttempts: 5,
  reconnectionDelayMax: 5000,
});

function App() {
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Connect manually to have control over when we connect
    socket.connect();

    // Setup listeners
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('global message', (message) => {
      setMessages((messages) => [...messages, `GLOBAL: ${message}`]);
    });

    socket.on('reconnect', () => {
      // Re-join the room automatically on reconnect
      if (currentRoom) {
        socket.emit('join room', currentRoom);
        console.log(`Re-joined room ${currentRoom} after reconnecting`);
        // Potentially fetch missed messages here
      }
    });

    return () => {
      socket.off('message');
      socket.off('global message');
      socket.off('reconnect');
    };
  }, [currentRoom]); // Depend on currentRoom to re-join correctly after reconnects

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join room', room);
      setCurrentRoom(room); // Update the current room state to re-join on reconnect
    }
  };

  const sendRoomMessage = () => {
    if (inputMessage !== '') {
      socket.emit('message', { room: currentRoom, message: inputMessage }); // Use currentRoom to ensure consistency
      setInputMessage('');
    }
  };

  const sendGlobalMessage = () => {
    if (inputMessage !== '') {
      socket.emit('global message', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      {currentRoom && <h3>Current Room: {currentRoom}</h3>}
      <div>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          type="text"
          placeholder="Enter room name..."
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
      />
      <button onClick={sendRoomMessage}>Send room message</button>
      <button onClick={sendGlobalMessage}>Send Global Message</button>
    </div>
  );
}

export default App;