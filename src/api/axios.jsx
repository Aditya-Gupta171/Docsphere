import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(import.meta.env.VITE_JWT_ACCESS_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(import.meta.env.VITE_JWT_REFRESH_KEY);
      
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, 
          { refreshToken },
          { withCredentials: true }
        );
        const { accessToken } = res.data.tokens;
        localStorage.setItem(import.meta.env.VITE_JWT_ACCESS_KEY, accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;