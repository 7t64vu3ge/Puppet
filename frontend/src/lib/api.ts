import axios from 'axios';

const api = axios.create({
    baseURL: '', // Proxied to backend via Vite
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('puppet_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchAssets = async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const response = await api.get('/api/assets', { params });
    return response.data;
};

export const fetchAssetById = async (id: string) => {
    const response = await api.get(`/api/assets/${id}`);
    return response.data;
};

export const fetchMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export default api;
