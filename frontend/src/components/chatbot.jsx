// src/components/Chat.js
import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      setResponse(res.data.choices[0].message.content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about your tasks..."
      />
      <button onClick={handleSend}>Send</button>
      <div>{response}</div>
    </div>
  );
};

export default Chat;
