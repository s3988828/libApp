import axios from 'axios';

const api = axios.create({
    baseURL: 'http://3.27.159.85:8080',
});

export default api;
