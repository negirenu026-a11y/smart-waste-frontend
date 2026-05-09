import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smart-waste-backend-8rgj.onrender.com/api',
    withCredentials: true, // Required for cookies
});

export default api;
