import React from 'react';
import axios from 'axios';

const TokenHandler = () => {
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
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
