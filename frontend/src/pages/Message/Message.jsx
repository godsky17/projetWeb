// Message.jsx
import React from 'react';
import Sidebar from '../../conpoments/SideBar/SideBar';
import './Message.css';

const Message = () => {
  return (
    <div className="app">
      <Sidebar />
      
      <div className="message-page">
        <div className="chat-container">
          {/* Barre de recherche */}
          <div className="search-bar">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="search-input"
              />
          </div>

          {/* Liste des chats */}
          <div className="chat-list">
            {/* Section Groupe */}
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

            {/* Section Discussions */}
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

        {/* Fenêtre de chat */}
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
            <div className="message received">
              I am fine and how are you?
              <span className="message-time">Today, 8:34pm</span>
            </div>
            <div className="message sent">
              I am doing well, Can we meet tomorrow?
              <span className="message-time">Today, 8:36pm</span>
            </div>
          </div>

          <div className="chat-input">
            <input type="text" placeholder="Tapez un message"/>
            <button className="send-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;