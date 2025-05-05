import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component for displaying product recommendations in the chatbot
 * @param {Array} products - Array of product objects to display
 * @param {function} onProductSelect - Callback when a product is selected
 */
const ProductRecommendation = ({ products, onProductSelect }) => {
  // If no products are provided, don't render anything
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="product-recommendations">
      <p className="recommendations-label">You might like these products:</p>
      
      <div className="products-carousel">
        {products.map((product) => (
          <div 
            key={product._id || product.id} 
            className="product-card"
            onClick={() => onProductSelect(product)}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <p className="product-price">Rs. {product.price}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Styles for the product recommendations */}
      <style jsx>{`
        .product-recommendations {
          margin: 10px 0;
          width: 100%;
        }
        
        .recommendations-label {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .products-carousel {
          display: flex;
          overflow-x: auto;
          gap: 10px;
          padding: 4px 0;
          scrollbar-width: thin;
        }
        
        .products-carousel::-webkit-scrollbar {
          height: 6px;
        }
        
        .products-carousel::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        
        .product-card {
          min-width: 150px;
          max-width: 150px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          background-color: white;
        }
        
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .product-image {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
          padding: 8px;
        }
        
        .product-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .product-info {
          padding: 8px;
        }
        
        .product-name {
          font-size: 0.75rem;
          font-weight: 500;
          margin: 0 0 4px 0;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .product-price {
          font-size: 0.7rem;
          font-weight: 600;
          color: #201658;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default ProductRecommendation;