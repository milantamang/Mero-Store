// backend/Controllers/ChatController.js
const Product = require("../Models/ProductModel");
const axios = require("axios");
require('dotenv').config();

const generateResponse = async (req, res) => {
  try {
    const { messages } = req.body;
    const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
    
    let systemContent = "You are a helpful e-commerce assistant for Mero-Store, an online clothing store. You can help with product inquiries, order tracking, return policies, shipping info, and general customer service. Keep answers concise and friendly. Knowledge cutoff date is the current date. You specialize in clothing, fashion advice, and e-commerce assistance.";
    
    // Check if the user is asking about products
    if (lastUserMessage.includes("product") || 
        lastUserMessage.includes("item") || 
        lastUserMessage.includes("clothing") ||
        lastUserMessage.includes("dress") ||
        lastUserMessage.includes("shirt") ||
        lastUserMessage.includes("pants")) {
      
      try {
        // Get relevant products from database
        const products = await Product.find().limit(5);
        
        // Only enhance if products were found
        if (products && products.length > 0) {
          let productInfo = "Here are some products we offer:\n";
          products.forEach(product => {
            productInfo += `- ${product.name}: Rs. ${product.price}. Available in sizes: ${product.size.join(", ")}.\n`;
          });
          
          // Enhance system content with product info
          systemContent = `${systemContent} Here is information about our current products: ${productInfo} Use this information to answer customer questions about our products.`;
        }
      } catch (dbError) {
        // If there's an error retrieving products, log it but continue with basic system content
        console.error("Error retrieving products:", dbError);
      }
    }

    // Make the API call to OpenAI with either basic or enhanced system content
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: systemContent
          },
          ...messages
        ],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

module.exports = {
  generateResponse,
};