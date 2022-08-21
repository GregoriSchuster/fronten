import axios from 'axios';

const api = axios.create({
    baseURL : "https://localhost:44356",
})

export default api;