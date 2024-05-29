import axios from 'axios';

const api = axios.create({
    baseURL: 'http://13.211.168.153:5000', //  Flask server's address
});

export default api;
