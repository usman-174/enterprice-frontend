// axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  // Your backend API base URL
  baseURL: process.env.REACT_APP_API||"https://enterprice-app-backend-production.up.railway.app/api" ,
  withCredentials:true
});



export default instance;