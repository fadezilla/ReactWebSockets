import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:8080');

function App() {
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join room', room);
    }
  };

  const sendMessage = () => {
    if (inputMessage !== '') {
      console.log('Sending message from room:', room);
      socket.emit('message', { room, message: inputMessage });
      setInputMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          type="text"
          placeholder="Enter room name..."
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      {console.log(messages)}
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
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;