import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../conpoments/SideBar/SideBar';
import './Message.css';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fonction pour récupérer les messages depuis l'API
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Fonction pour défiler automatiquement vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fonction pour envoyer un nouveau message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      time: `Aujourd'hui, ${currentTime}`,
      type: "sent"
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // 🔹 Envoyer le message à l'API (optionnel)
    try {
      await fetch('http://localhost:5000/messages', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
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