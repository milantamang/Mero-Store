import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from './GeminiService';
import SuggestedQuestions from './SuggestedQuestions';
import ProductRecommendation from './ProductRecommendation';
import config from './config';
import { saveChatHistory, loadChatHistory, clearChatHistory, generateSessionId } from './chatHistoryUtil';
import { getRecommendedProducts, searchProducts } from './productService';
import { analyzeMessage, INTENTS, ENTITY_TYPES } from './nlpUtil';
import './ChatBot.css';  // Function to analyze message and get product recommendations if relevant
  const analyzeAndGetRecommendations = async (message) => {
    try {
      // Analyze the message to determine intent and extract entities
      const analysis = analyzeMessage(message);
      
      // If the intent is product search or category browse, try to get recommendations
      if (
        analysis.intent === INTENTS.PRODUCT_SEARCH || 
        analysis.intent === INTENTS.CATEGORY_BROWSE
      ) {
        // Extract category if available
        const category = analysis.entities[ENTITY_TYPES.CATEGORY];
        
        // Get recommended products based on message content
        let products = [];
        
        // If the message contains specific search terms, use search
        if (analysis.intent === INTENTS.PRODUCT_SEARCH) {
          products = await searchProducts(message);
        } else {
          // Otherwise, get category-based recommendations
          products = await getRecommendedProducts(category);
        }
        
        // Update recommendations state
        if (products && products.length > 0) {
          setRecommendedProducts(products);
          setShowRecommendations(true);
        } else {
          setShowRecommendations(false);
        }
      } else {
        // For other intents, don't show recommendations
        setShowRecommendations(false);
      }
    } catch (error) {
      console.error('Error analyzing message or getting recommendations:', error);
      setShowRecommendations(false);
    }
  };
  
  // Function to handle selecting a product from recommendations
  const handleProductSelect = (product) => {
    // Navigate to the product details page
    window.location.href = `/products/${product._id || product.id}`;
    
    // Close the chat window
    setIsOpen(false);
  };
  
  // Function to handle clearing the chat history
  const handleClearChat = () => {
    // Show a confirmation dialog
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      // Clear the chat history from localStorage
      clearChatHistory(sessionId);
      
      // Reset the messages state to just the greeting
      setMessages([{
        role: 'assistant',
        content: config.chatbot.defaultGreeting
      }]);
      
      // Clear any product recommendations
      setRecommendedProducts([]);
      setShowRecommendations(false);
    }
  };import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from './GeminiService';
import SuggestedQuestions from './SuggestedQuestions';
import config from './config';
import { saveChatHistory, loadChatHistory, clearChatHistory, generateSessionId } from './chatHistoryUtil';
import './ChatBot.css';

const EnhancedChatBot = () => {
  // Session ID for persisting chat across page loads
  const [sessionId] = useState(() => {
    // Try to get an existing session ID from localStorage, or generate a new one
    const storedSessionId = localStorage.getItem('mero_store_chat_session_id');
    if (storedSessionId) return storedSessionId;
    
    const newSessionId = generateSessionId();
    localStorage.setItem('mero_store_chat_session_id', newSessionId);
    return newSessionId;
  });
  
  // State for managing the chat interface
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for chat history
  const [messages, setMessages] = useState(() => {
    // Try to load existing chat history
    const savedHistory = loadChatHistory(sessionId);
    
    // If there's no saved history, start with the default greeting
    if (!savedHistory || savedHistory.length === 0) {
      return [{
        role: 'assistant',
        content: config.chatbot.defaultGreeting
      }];
    }
    
    return savedHistory;
  });
  
  // State for product recommendations
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Save chat history whenever messages change
  useEffect(() => {
    saveChatHistory(messages, sessionId);
  }, [messages, sessionId]);
  
  // Ref for auto-scrolling to the latest message
  const messagesEndRef = useRef(null);

  // Function to handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // If there's no message to send, do nothing
    const messageToSend = inputMessage.trim();
    if (messageToSend === '') return;
    
    // Store the message before clearing the input
    const currentMessage = messageToSend;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: currentMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Analyze the message for intent and potential product recommendations
      await analyzeAndGetRecommendations(currentMessage);
      
      // Get response from Gemini
      const aiResponse = await sendMessage(currentMessage, messages);
      
      // Add AI response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }
      ]);
      
      // Clear recommendations on error
      setShowRecommendations(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <div 
        className="chat-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          {/* Chat header */}
          <div className="chat-header">
            <h3>Mero-Store Assistant</h3>
            <div className="header-actions">
              {/* Clear chat button */}
              <button 
                className="clear-button" 
                onClick={handleClearChat}
                aria-label="Clear chat history"
                title="Clear chat history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              {/* Close button */}
              <button 
                className="close-button" 
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="messages-container">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.content}
              </div>
            ))}
            
            {/* Show suggested questions after the greeting message */}
            {messages.length === 1 && messages[0].role === 'assistant' && (
              <SuggestedQuestions 
                onSelectQuestion={(question) => {
                  // When a suggested question is clicked, handle it like a user message
                  setInputMessage(question);
                  handleSendMessage({ preventDefault: () => {} });
                }}
              />
            )}
            
            {/* Show product recommendations when available */}
            {showRecommendations && recommendedProducts.length > 0 && (
              <ProductRecommendation 
                products={recommendedProducts}
                onProductSelect={handleProductSelect}
              />
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message input form */}
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || inputMessage.trim() === ''}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;