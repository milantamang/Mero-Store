// config.js
// This file contains configuration settings for the application

const config = {
    // API Keys and credentials
    gemini: {
      apiKey: process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY',
      modelName: 'gemini-2.0-flash', // Use the latest model
    },
    
    // Chatbot settings
    chatbot: {
      defaultGreeting: "Hello! I'm your Mero-Store shopping assistant. How can I help you today?",
      systemPrompt: `You are a helpful shopping assistant for an e-commerce clothing store called Mero-Store.
  Your purpose is to help customers find products, answer questions about clothing, 
  provide style advice, and assist with order-related inquiries.
  
  Information about Mero-Store:
  - We sell clothing for men, women, and children
  - We offer various sizes: S, M, L, XL, XXL
  - We have categories like casual wear, formal wear, and seasonal collections
  - We provide shipping within the country with a standard fee of Rs. 200
  - Our return policy allows returns within 7 days of delivery
  
  Always be polite, concise, and helpful. If you don't know the answer to a specific
  question about inventory or order status, suggest that the customer contact customer 
  service through the "Contact Us" page.`,
      
      // Appearance settings
      appearance: {
        primaryColor: '#201658', // Match with your website's theme
        secondaryColor: '#1D24CA',
        fontFamily: 'Poppins, sans-serif',
      },
      
      // Behavioral settings
      behavior: {
        autoOpen: false, // Whether to automatically open the chat on page load
        greetingDelay: 3000, // Delay before showing the greeting message (in ms)
        inactivityTimeout: 300000, // Close chat after inactivity (5 minutes)
        suggestedQuestions: [
          "What are the trending styles this season?",
          "Do you have any ongoing discounts?",
          "How do I track my order?",
          "What is your return policy?",
        ],
      }
    }
  };
  
  export default config;