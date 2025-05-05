/**
 * Utility functions for managing chat history
 * This allows the chat history to persist between page refreshes
 * and can be used to sync conversations with a backend if needed.
 */

// The key used to store chat history in localStorage
const CHAT_HISTORY_KEY = 'mero_store_chat_history';

/**
 * Save the current chat history to localStorage
 * @param {Array} messages - Array of message objects
 * @param {string} sessionId - Optional session ID for multiple chat sessions
 */
export const saveChatHistory = (messages, sessionId = 'default') => {
  try {
    // Get existing history or initialize empty object
    const existingHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    const history = existingHistory ? JSON.parse(existingHistory) : {};
    
    // Update the history with the current session
    history[sessionId] = messages;
    
    // Save back to localStorage
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    
    return true;
  } catch (error) {
    console.error('Error saving chat history:', error);
    return false;
  }
};

/**
 * Load chat history from localStorage
 * @param {string} sessionId - Optional session ID for multiple chat sessions
 * @returns {Array} Array of message objects, or default greeting if no history
 */
export const loadChatHistory = (sessionId = 'default') => {
  try {
    const existingHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!existingHistory) return null;
    
    const history = JSON.parse(existingHistory);
    return history[sessionId] || null;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return null;
  }
};

/**
 * Clear the chat history for a specific session or all sessions
 * @param {string} sessionId - Optional session ID, if null clears all history
 */
export const clearChatHistory = (sessionId = null) => {
  try {
    if (sessionId === null) {
      // Clear all chat history
      localStorage.removeItem(CHAT_HISTORY_KEY);
    } else {
      // Clear only specified session
      const existingHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (existingHistory) {
        const history = JSON.parse(existingHistory);
        delete history[sessionId];
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
      }
    }
    return true;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
};

/**
 * Generate a unique session ID based on timestamp and random string
 * @returns {string} Unique session ID
 */
export const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Add a message to the chat history without saving to localStorage
 * @param {Array} currentHistory - Current chat history array
 * @param {string} role - Role of the message sender ('user' or 'assistant')
 * @param {string} content - Content of the message
 * @returns {Array} Updated chat history array
 */
export const addMessageToHistory = (currentHistory, role, content) => {
  return [...currentHistory, { role, content }];
};

export default {
  saveChatHistory,
  loadChatHistory,
  clearChatHistory,
  generateSessionId,
  addMessageToHistory
};