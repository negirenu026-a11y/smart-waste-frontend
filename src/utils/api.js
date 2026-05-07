import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smart-waste-backends.onrender.com/api',
    withCredentials: true, // Required for cookies
});

export default api;
