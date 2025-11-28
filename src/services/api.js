import axios from "axios";


const api = axios.create({
  // baseURL: "https://e-commerce-cndv.onrender.com", 
  baseURL: "https://airxsolar-api.azurewebsites.net"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;



