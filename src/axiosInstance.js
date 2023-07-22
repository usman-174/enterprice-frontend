// axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  // Your backend API base URL
  baseURL: process.env.API ,
  withCredentials:true
});

// Interceptor to check for 401 status code
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the response status code is 401 (Unauthorized)
    if (error.response.status === 401 && !window.location.href.includes('login')) {
    
      window.location.href = '/login'; // Replace '/login' with your actual login page URL
    }
    return Promise.reject(error);
  }
);

export default instance;