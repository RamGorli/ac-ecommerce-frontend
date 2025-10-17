// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080", 
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;



//Arjun's
import axios from "axios";


const api = axios.create({
  baseURL: "https://e-commerce-cndv.onrender.com", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;



