import axios from 'axios';

const api = axios.create({
    baseURL: 'http://3.107.59.62:5000', //  Flask server's address
});

export default api;
