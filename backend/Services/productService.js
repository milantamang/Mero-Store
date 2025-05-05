/**
 * Service for accessing product data to use with the chatbot
 * In a real implementation, this would connect to your e-commerce backend API
 */

// API base URL
const API_BASE_URL = 'http://localhost:5000/api/v1';

/**
 * Fetch all products
 * @returns {Promise<Array>} Array of product objects
 */
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of product objects
 */
export const getProductsByCategory = async (category) => {
  try {
    // In a real implementation, you would use a category filter parameter
    // For now, we'll fetch all products and filter on the client side
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    if (!data.products) return [];
    
    // Filter products by category
    return data.products.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return [];
  }
};

/**
 * Search products by keyword
 * @param {string} keyword - Search term
 * @returns {Promise<Array>} Array of matching product objects
 */
export const searchProducts = async (keyword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/search?searchQuery=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

/**
 * Get recommended products based on user preferences or history
 * @param {string} category - Optional category to filter by
 * @param {Array} preferences - Optional array of user preferences
 * @returns {Promise<Array>} Array of recommended product objects
 */
export const getRecommendedProducts = async (category = null, preferences = []) => {
  try {
    // Fetch products (in a real app, you would have a recommendations API)
    const allProducts = await getAllProducts();
    
    // If category is specified, filter by category
    let filtered = category 
      ? allProducts.filter(product => product.category.toLowerCase() === category.toLowerCase())
      : allProducts;
    
    // If there are no products after filtering, return all products
    if (filtered.length === 0) {
      filtered = allProducts;
    }
    
    // Limit to 5 products max
    return filtered.slice(0, 5);
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    return [];
  }
};

export default {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  getRecommendedProducts
};