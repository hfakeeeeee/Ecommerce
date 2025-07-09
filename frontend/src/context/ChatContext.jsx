import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchChatHistory();
    }
  }, [isAuthenticated, token]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const history = await response.json();
        setMessages(history);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        const { userMessage, botResponse } = await response.json();
        setMessages(prev => [...prev, userMessage, botResponse]);
        return { success: true };
      } else {
        // Try to parse error message
        let errorMsg = 'Failed to send message';
        try {
          const err = await response.json();
          errorMsg = err.error || errorMsg;
        } catch {}
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const value = {
    messages,
    isOpen,
    sendMessage,
    clearChat,
    toggleChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 