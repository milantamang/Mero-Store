import React from 'react';
import axios from 'axios';

const TokenHandler = () => {
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
       if (config.url.includes('https://api.cloudinary.com/v1_1')) {
        // Do not add the Authorization header for Cloudinary requests
        return config;
      }
      // Get token from local storage
      const token = localStorage.getItem('token');
      // If token exists, set it in the request headers
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  return <></>;
};

export default TokenHandler;
