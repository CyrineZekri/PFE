import axios from 'axios';
// Create an axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default api;
