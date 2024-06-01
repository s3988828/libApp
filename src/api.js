import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ec2-3-27-159-85.ap-southeast-2.compute.amazonaws.com',
});

export default api;
