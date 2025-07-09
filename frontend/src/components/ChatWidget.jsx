import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatWidget = () => {
  const [message, setMessage] = useState('');
  const { messages, isOpen, sendMessage, clearChat, toggleChat } = useChat();
  const { isAuthenticated, loading, user } = useAuth();
  const messagesEndRef = useRef(null);
  const isDarkMode = document.documentElement.classList.contains('dark');
  const [error, setError] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, loading, user });
  }, [isAuthenticated, loading, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom when chat is opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the chat container is fully rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const result = await sendMessage(message);
    if (result && result.success) {
      setMessage('');
      setError('');
    } else {
      setError(result?.error || 'Failed to send message');
    }
  };

  const handleClearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    clearChat();
    setShowClearConfirm(false);
  };

  const cancelClearChat = () => {
    setShowClearConfirm(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    toggleChat(); // Close chat when navigating to product
  };

  const renderMessage = (msg) => {
    const lines = msg.message.split('\n');
    console.log('Rendering message lines:', lines); // Debug log
    return lines.map((line, i) => {
      console.log(`Processing line ${i}: "${line}"`); // Debug log
      
      // Check if this line is a separator
      if (line.startsWith('━━━')) {
        return (
          <React.Fragment key={i}>
            <div className="border-t border-gray-300 dark:border-gray-600 my-1"></div>
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
      // Check if this line is a product link (new format)
      else if (line.startsWith('🔗 **View Product:** /product/')) {
        const productId = line.replace('🔗 **View Product:** /product/', '');
        console.log('Found product link with ID:', productId); // Debug log
        return (
          <React.Fragment key={i}>
            <button
              onClick={() => handleProductClick(productId)}
              className="text-blue-500 hover:text-blue-700 underline cursor-pointer font-semibold"
            >
              🔗 View Product Details
            </button>
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
      // Check if this line is an image (new format)
      else if (line.startsWith('📸 **Image:** ')) {
        const imageUrl = line.replace('📸 **Image:** ', '');
        console.log('Found image URL:', imageUrl); // Debug log
        return (
          <React.Fragment key={i}>
            <img 
              src={imageUrl} 
              alt="Product" 
              className="w-20 h-20 object-cover rounded-lg mt-2 border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                console.log('Image failed to load:', imageUrl); // Debug log
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', imageUrl); // Debug log
              }}
            />
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
      // Fallback: Check if this line is a product link (old format)
      else if (line.startsWith('🔗 /product/')) {
        const productId = line.replace('🔗 /product/', '');
        console.log('Found product link (old format) with ID:', productId); // Debug log
        return (
          <React.Fragment key={i}>
            <button
              onClick={() => handleProductClick(productId)}
              className="text-blue-500 hover:text-blue-700 underline cursor-pointer font-semibold"
            >
              🔗 View Product Details
            </button>
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
      // Fallback: Check if this line is an image (old format)
      else if (line.startsWith('🖼️ ')) {
        const imageUrl = line.replace('🖼️ ', '');
        console.log('Found image URL (old format):', imageUrl); // Debug log
        return (
          <React.Fragment key={i}>
            <img 
              src={imageUrl} 
              alt="Product" 
              className="w-20 h-20 object-cover rounded-lg mt-2 border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => {
                console.log('Image failed to load (old format):', imageUrl); // Debug log
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Image loaded successfully (old format):', imageUrl); // Debug log
              }}
            />
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
      // Handle bold text (**text**)
      else if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <React.Fragment key={i}>
            {parts.map((part, j) => (
              <span key={j} className={j % 2 === 1 ? 'font-bold' : ''}>
                {part}
              </span>
            ))}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
      // Regular text
      else {
        return (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      }
    });
  };

  // Don't render anything while loading
  if (loading) return null;

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 chat-widget">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className={`${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-full p-4 shadow-lg transition-colors duration-200`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className={`${
          isDarkMode 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-900'
          } rounded-lg shadow-xl w-96 h-[500px] flex flex-col transition-colors duration-200`}
        >
          <div className={`p-4 ${
            isDarkMode 
              ? 'bg-blue-600' 
              : 'bg-blue-500'
            } text-white rounded-t-lg flex justify-between items-center`}
          >
            <h3 className="font-semibold">Chat Support</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleClearChat} 
                className="text-red-300 hover:text-red-100 transition-colors duration-200 p-1 rounded-full hover:bg-red-600/20"
                title="Clear conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button onClick={toggleChat} className="text-white hover:text-gray-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className={`flex-1 overflow-y-auto p-4 ${
            isDarkMode 
              ? 'bg-gray-800' 
              : 'bg-gray-50'
          }`}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.userMessage ? 'text-right' : 'text-left'}`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {!msg.userMessage && (
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Bot
                    </div>
                  )}
                </div>
                <div
                  className={`inline-block p-2 rounded-lg ${
                    msg.userMessage
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-200 text-gray-800'
                  } ${msg.userMessage ? 'rounded-br-none' : 'rounded-bl-none'}`}
                >
                  {renderMessage(msg)}
                </div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className={`p-4 border-t ${
            isDarkMode 
              ? 'border-gray-700 bg-gray-800' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex flex-col gap-2 w-full">
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  type="submit"
                  className={`${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-4 py-2 rounded-lg transition-colors duration-200`}
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Custom Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className={`${
            isDarkMode 
              ? 'bg-gray-800 text-white' 
              : 'bg-white text-gray-900'
          } rounded-lg shadow-xl p-6 max-w-sm mx-4 transform transition-all`}>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Clear Conversation</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to clear all chat messages? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelClearChat}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 