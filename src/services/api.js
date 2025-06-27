import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.15:4000/api'
});

// http://192.168.1.15:3000/

export default api;


//http://192.168.1.11:3000
//http://localhost:4000