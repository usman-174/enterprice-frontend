// axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  // Your backend API base URL
  baseURL: process.env.REACT_APP_API||"https://enterprice-app-backend-production.up.railway.app/api" ,
  withCredentials:true
});

// Interceptor to check for 401 status code
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the response status code is 401 (Unauthorized)
   
    return Promise.reject(error);
  }
);

export default instance;