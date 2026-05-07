import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smart-waste-backend-od1c.onrender.com/api',
    withCredentials: true, // Required for cookies
});

export default api;
