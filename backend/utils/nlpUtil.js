/**
 * Simple Natural Language Processing utilities for the chatbot
 * This helps identify intents and extract entities from user messages
 */

// Intent types
export const INTENTS = {
    GREETING: 'greeting',
    PRODUCT_SEARCH: 'product_search',
    CATEGORY_BROWSE: 'category_browse',
    ORDER_STATUS: 'order_status',
    SHIPPING_INFO: 'shipping_info',
    RETURN_POLICY: 'return_policy',
    HELP: 'help',
    UNKNOWN: 'unknown'
  };
  
  // Common entity types
  export const ENTITY_TYPES = {
    PRODUCT: 'product',
    CATEGORY: 'category',
    COLOR: 'color',
    SIZE: 'size',
    PRICE: 'price',
    ORDER_ID: 'order_id'
  };
  
  // Keywords and phrases for detecting intents
  const intentPatterns = {
    [INTENTS.GREETING]: [
      'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 
      'good evening', 'howdy', 'what\'s up', 'hola'
    ],
    [INTENTS.PRODUCT_SEARCH]: [
      'find', 'search', 'looking for', 'do you have', 'where can i find', 
      'show me', 'i want to buy', 'i need', 'i\'m interested in'
    ],
    [INTENTS.CATEGORY_BROWSE]: [
      'show me', 'browse', 'view', 'display', 'list', 'categories', 
      'men', 'women', 'kids', 'children'
    ],
    [INTENTS.ORDER_STATUS]: [
      'order status', 'my order', 'track', 'shipping status', 'package', 
      'delivery', 'where is my order', 'when will my order arrive'
    ],
    [INTENTS.SHIPPING_INFO]: [
      'shipping', 'delivery', 'how long', 'how much does shipping cost', 
      'shipping fee', 'delivery time', 'when will it arrive'
    ],
    [INTENTS.RETURN_POLICY]: [
      'return', 'refund', 'exchange', 'send back', 'return policy', 
      'how to return', 'can i return', 'money back'
    ],
    [INTENTS.HELP]: [
      'help', 'support', 'assistance', 'guide', 'how to', 'how do i', 
      'can you help', 'i need help'
    ]
  };
  
  // Category keywords
  const categoryKeywords = {
    'men': ['men', 'man', 'male', 'guy', 'gentleman', 'mens', "men's"],
    'women': ['women', 'woman', 'female', 'lady', 'ladies', 'womens', "women's"],
    'kids': ['kids', 'kid', 'child', 'children', 'boy', 'girl', 'baby', 'toddler']
  };
  
  // Color keywords
  const colors = [
    'red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 
    'pink', 'brown', 'gray', 'grey', 'navy', 'teal', 'turquoise', 'maroon', 
    'olive', 'silver', 'gold', 'beige', 'tan'
  ];
  
  // Size keywords
  const sizes = ['s', 'm', 'l', 'xl', 'xxl', 'small', 'medium', 'large', 'extra large'];
  
  /**
   * Identify the primary intent from a user message
   * @param {string} message - User message text
   * @returns {string} Intent identifier from INTENTS
   */
  export const identifyIntent = (message) => {
    if (!message || typeof message !== 'string') {
      return INTENTS.UNKNOWN;
    }
    
    const lowerMessage = message.toLowerCase();
    
    // Check each intent pattern for matches
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      for (const pattern of patterns) {
        if (lowerMessage.includes(pattern)) {
          return intent;
        }
      }
    }
    
    return INTENTS.UNKNOWN;
  };
  
  /**
   * Extract entities (category, color, size, etc.) from a user message
   * @param {string} message - User message text
   * @returns {Object} Extracted entities by type
   */
  export const extractEntities = (message) => {
    if (!message || typeof message !== 'string') {
      return {};
    }
    
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\\s+/);
    const entities = {};
    
    // Extract categories
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          entities[ENTITY_TYPES.CATEGORY] = category;
          break;
        }
      }
      if (entities[ENTITY_TYPES.CATEGORY]) break;
    }
    
    // Extract colors
    for (const color of colors) {
      if (lowerMessage.includes(color)) {
        entities[ENTITY_TYPES.COLOR] = color;
        break;
      }
    }
    
    // Extract sizes
    for (const size of sizes) {
      // Check for exact size matches (to avoid matching "s" in other words)
      const sizeRegex = new RegExp(`\\b${size}\\b`, 'i');
      if (sizeRegex.test(lowerMessage)) {
        entities[ENTITY_TYPES.SIZE] = size.toUpperCase();
        break;
      }
    }
    
    // Extract price ranges
    const priceRegex = /\\$(\\d+)(?:\\s*-\\s*\\$(\\d+))?|under\\s+\\$(\\d+)|over\\s+\\$(\\d+)|(\\d+)\\s*dollars/i;
    const priceMatch = lowerMessage.match(priceRegex);
    if (priceMatch) {
      if (priceMatch[1] && priceMatch[2]) {
        // Range: $X - $Y
        entities[ENTITY_TYPES.PRICE] = {
          min: parseInt(priceMatch[1]),
          max: parseInt(priceMatch[2])
        };
      } else if (priceMatch[3]) {
        // Under $X
        entities[ENTITY_TYPES.PRICE] = {
          max: parseInt(priceMatch[3])
        };
      } else if (priceMatch[4]) {
        // Over $X
        entities[ENTITY_TYPES.PRICE] = {
          min: parseInt(priceMatch[4])
        };
      } else if (priceMatch[5]) {
        // X dollars
        entities[ENTITY_TYPES.PRICE] = {
          value: parseInt(priceMatch[5])
        };
      }
    }
    
    // Extract order ID (simple pattern)
    const orderIdRegex = /order\\s+(?:id|number|#)?\\s*(?:#)?(\\w{6,})/i;
    const orderIdMatch = lowerMessage.match(orderIdRegex);
    if (orderIdMatch && orderIdMatch[1]) {
      entities[ENTITY_TYPES.ORDER_ID] = orderIdMatch[1];
    }
    
    return entities;
  };
  
  /**
   * Format a complete analysis of a user message
   * @param {string} message - User message text
   * @returns {Object} Analysis with intent and entities
   */
  export const analyzeMessage = (message) => {
    return {
      intent: identifyIntent(message),
      entities: extractEntities(message),
      originalMessage: message
    };
  };
  
  export default {
    INTENTS,
    ENTITY_TYPES,
    identifyIntent,
    extractEntities,
    analyzeMessage
  };