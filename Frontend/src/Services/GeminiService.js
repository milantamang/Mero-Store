import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../Configuration/config';

// This file contains the service functions for interacting with Google's Gemini API

// Initialize the Google Generative AI with your API key from the config
const API_KEY = config.gemini.apiKey;
const MODEL_NAME = config.gemini.modelName;
const DEFAULT_SYSTEM_PROMPT = config.chatbot.systemPrompt;

// Create the Gemini API instance
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Initialize a chat with Gemini 2.0 Flash model
 * @returns {Object} The chat session object
 */
export const initializeChat = () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const chat = model.startChat({
      history: [
        {
          role: "model",
          parts: [{ text: "Hello! I'm your shopping assistant. How can I help you today?" }],
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    return chat;
  } catch (error) {
    console.error('Failed to initialize Gemini chat:', error);
    throw new Error('Failed to initialize chat service');
  }
};

/**
 * Send a message to the Gemini AI and get a response
 * @param {string} message - The user's message
 * @param {Array} history - The chat history
 * @returns {Promise<string>} The AI's response
 */
export const sendMessage = async (message, history = []) => {
  try {
    // For Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Format history for Gemini API
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    
    // Add system prompt at the beginning if it's not already there
    if (formattedHistory.length === 0 || 
        (formattedHistory[0].role !== 'model' && !formattedHistory[0].text?.includes('shopping assistant'))) {
      formattedHistory.unshift({
        role: 'model',
        parts: [{ text: DEFAULT_SYSTEM_PROMPT }]
      });
    }
    
    // Create a chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    // Generate content based on user input
    const result = await chat.sendMessage(message);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return 'Sorry, I encountered an error processing your request. Please try again.';
  }
};

/**
 * Format the chat history to be compatible with Gemini's API
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Array} Formatted history for Gemini API
 */
export const formatHistoryForGemini = (messages) => {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
};

export default {
  initializeChat,
  sendMessage,
  formatHistoryForGemini
};