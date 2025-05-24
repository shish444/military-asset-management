import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    config.headers['X-User-Role'] = user.role;
    if (user.base) {
      config.headers['X-User-Base'] = user.base;
    }
  }
  return config;
});

export default api;