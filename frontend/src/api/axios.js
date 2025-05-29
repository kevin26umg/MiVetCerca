import axios from 'axios';


// const api = axios.create({
//   baseURL: import.meta.env.DEV
//     ? 'http://localhost:8000/api' // Dev local
//     : '/api',                     // Producción con Nginx proxy
// });


const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});


// const api = axios.create({
//   baseURL: "/api",
// });


// ⬇️ Este interceptor agrega automáticamente el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
