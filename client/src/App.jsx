import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:8080');

function App() {
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const [roomClients, setRoomClients] = useState([]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
    socket.on('global message', (message) => {
      setMessages((messages) => [...messages, `GLOBAL: ${message}`]);
    });
    socket.on('room clients', (clients) => {
      setRoomClients(clients);
      console.log('Current clients in room:', clients);
    });

    return () => {
      socket.off('message');
      socket.off('global message');
      socket.off('room clients');
    };
  }, []);

  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('set username', { username, room }); // Emit event to set username
      setCurrentRoom(room);
    }
  };

  const sendRoomMessage = () => {
    if (inputMessage !== '') {
      socket.emit('message', { room: currentRoom, message: inputMessage });
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Enter your username..."
        />
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
      <div>
        <h4>Clients in Room:</h4>
        <ul>
          {roomClients.map((client) => (
            <li key={client.id}>{client.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;