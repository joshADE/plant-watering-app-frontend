import axios from "axios";

const instance = axios.create({
    baseURL: 'https://shipvista-backend.herokuapp.com/api/',
});

export default instance;