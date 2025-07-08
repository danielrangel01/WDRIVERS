import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//
//https://wdrivers-backend-production.up.railway.app/

// http://192.168.1.15:3000/

export default api;

//http://192.168.1.11:3000
//http://localhost:4000
