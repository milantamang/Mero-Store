// components/ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  // State for chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Mero-Store shopping assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  
  // State for user input
  const [input, setInput] = useState('');
  
  // State to control chat visibility
  const [isOpen, setIsOpen] = useState(false);
  
  // Reference to auto-scroll to bottom of messages
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a message
  const handleSend = (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Generate bot response
    setTimeout(() => {
      handleBotResponse(input);
    }, 600);
  };

  // Generate simple bot responses based on keywords
  const handleBotResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();
    let response = '';
    
    // Simple keyword matching
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
      response = "Hi there! How can I help you shop today?";
    } else if (lowercaseInput.includes('shipping')) {
      response = "We offer free shipping on orders over Rs.2000!";
    } else if (lowercaseInput.includes('return') || lowercaseInput.includes('refund')) {
      response = "Our return policy allows returns within 30 days of delivery.";
    } else if (lowercaseInput.includes('payment') || lowercaseInput.includes('pay')) {
      response = "We accept various payment methods including credit/debit cards and cash on delivery.";
    } else if (lowercaseInput.includes('size') || lowercaseInput.includes('sizing')) {
      response = "We offer sizes S, M, L, XL, and XXL for most of our clothing items.";
    } else {
      response = "Thank you for your question. Our team will get back to you shortly. Is there anything else I can help you with?";
    }
    
    // Add bot response
    const botMessage = {
      id: Date.now(),
      text: response,
      sender: 'bot'
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat toggle button */}
      <button 
        className="w-14 h-14 rounded-full bg-primary text-white text-2xl flex items-center justify-center shadow-lg hover:bg-sec transition-all transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? '✕' : '💬'}
      </button>
      
      {/* Chat dialog */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[450px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h3 className="text-lg font-semibold m-0">Mero Store Assistant</h3>
            <p className="text-sm opacity-80 mt-1">We're here to help</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  msg.sender === 'bot' 
                    ? 'bg-gray-200 self-start rounded-bl-sm' 
                    : 'bg-primary text-white self-end rounded-br-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="flex border-t border-gray-200 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit"
              className="ml-2 px-4 bg-primary text-white rounded-full font-medium hover:bg-sec"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;