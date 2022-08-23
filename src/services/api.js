import axios from 'axios';

const api = axios.create({
    baseURL : "https://apibravi.herokuapp.com/",
})

export default api;