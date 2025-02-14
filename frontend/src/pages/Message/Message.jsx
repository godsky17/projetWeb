import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../conpoments/SideBar/SideBar';
import './Message.css';

const Message = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "I am fine and how are you?",
      time: "Today, 8:34pm",
      type: "received"
    },
    {
      id: 2,
      text: "I am doing well, Can we meet tomorrow?",
      time: "Today, 8:36pm",
      type: "sent"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      time: `Today, ${currentTime}`,
      type: "sent"
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="app">
      <Sidebar />
      
      <div className="message-page">
        {/* Le reste du code jusqu'à chat-messages reste identique */}
        <div className="chat-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="search-input"
            />
          </div>

          <div className="chat-list">
            <div className="section">
              <h2>Groupe</h2>
              {[1, 2, 3].map((item) => (
                <div key={item} className="chat-item">
                  <img src="/images/jotaro.jpeg" alt="avatar" className="avatar"/>
                  <div className="chat-info">
                    <div className="chat-header">
                      <h3>Friends Forever</h3>
                      <span>Today, 9:52pm</span>
                    </div>
                    <p>Hahahahah!</p>
                  </div>
                  <i className="fas fa-volume-up audio-icon"></i>
                </div>
              ))}
            </div>

            <div className="section">
              <h2>Discussions</h2>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="chat-item">
                  <img src="/images/jotaro.jpeg" alt="avatar" className="avatar"/>
                  <div className="chat-info">
                    <div className="chat-header">
                      <h3>Friends Forever</h3>
                      <span>Today, 9:52pm</span>
                    </div>
                    <p>Hahahahah!</p>
                  </div>
                  <i className="fas fa-volume-up audio-icon"></i>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chat-window">
          <div className="chat-window-header">
            <div className="user-info">
              <img src="/images/jotaro.jpeg" alt="Anil" className="avatar"/>
              <div>
                <h3>Anil</h3>
                <span>Online - Last seen, 2:02pm</span>
              </div>
            </div>
            <div className="chat-actions">
              <i className="fas fa-phone"></i>
              <i className="fas fa-video"></i>
              <i className="fas fa-ellipsis-v"></i>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.text}
                <span className="message-time">{message.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez un message"
            />
            <button type="submit" className="send-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Message;