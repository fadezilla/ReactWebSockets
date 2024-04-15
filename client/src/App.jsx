import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:8080');

function App() {
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

  const sendMessage = () => {
    socket.send(inputMessage);
    setInputMessage('');
  };

  return (
    <div>
      <h2>Chat Room</h2>
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