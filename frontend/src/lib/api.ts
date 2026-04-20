import axios from 'axios';

const api = axios.create({
    baseURL: '', // Same-origin in production, proxied to the backend during local Vite development.
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('puppet_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchAssets = async (params: { q?: string; page?: number } = {}) => {
    const response = await api.get('/api/marketplace', { params });
    return response.data;
};

export const fetchAssetById = async (id: string) => {
    const response = await api.get(`/api/sketchfab/models/${id}`);
    return response.data;
};

export const fetchMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const toggleLikeAsset = async (id: string) => {
    const response = await api.post(`/auth/like/${id}`);
    return response.data;
};

export const buyAsset = async (id: string) => {
    const response = await api.post(`/auth/buy/${id}`);
    return response.data;
};

export const updateProfile = async (data: { name?: string; avatar?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
};

export const changePassword = async () => {
    const response = await api.post('/auth/change-password');
    return response.data;
};

export const becomeSeller = async () => {
    const response = await api.post('/auth/become-seller');
    return response.data;
};

export const createAsset = async (data: FormData) => {
    const response = await api.post('/api/assets', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const downloadAsset = async (id: string) => {
    const response = await api.get(`/api/sketchfab/models/${id}/download`);
    return response.data;
};

export default api;
