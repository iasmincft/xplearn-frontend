// src/boot/axios.js
import { boot } from 'quasar/wrappers';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/'; 


const api = axios.create({ baseURL: API_BASE_URL });

export default boot(({ app }) => {

    app.config.globalProperties.$axios = axios;
    app.config.globalProperties.$api = api;

});

export { api, axios };