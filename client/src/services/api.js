import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API URL
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;