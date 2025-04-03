import React from 'react';
import { Link } from 'react-router-dom';

const Thanks = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your order has been placed successfully.
      </p>
      <Link
        to="/"
        className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default Thanks;
