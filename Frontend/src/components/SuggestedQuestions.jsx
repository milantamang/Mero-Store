import React from 'react';
import config from './config';

/**
 * Component for displaying suggested questions in the chatbot
 * @param {function} onSelectQuestion - Callback function when a question is selected
 */
const SuggestedQuestions = ({ onSelectQuestion }) => {
  const { suggestedQuestions } = config.chatbot.behavior;
  
  // If no suggested questions are available, don't render anything
  if (!suggestedQuestions || suggestedQuestions.length === 0) {
    return null;
  }
  
  return (
    <div className="suggested-questions">
      <p className="suggested-label">You can ask me about:</p>
      <div className="questions-container">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            className="question-button"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </button>
        ))}
      </div>
      
      {/* Additional styles for the suggested questions */}
      <style jsx>{`
        .suggested-questions {
          padding: 10px 15px;
          margin-bottom: 10px;
        }
        
        .suggested-label {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .questions-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .question-button {
          background-color: #f3f4f6;
          color: #201658;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 6px 12px;
          font-size: 0.85rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .question-button:hover {
          background-color: #e5e7eb;
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default SuggestedQuestions;