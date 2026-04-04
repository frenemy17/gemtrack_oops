import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gem-track-f38d.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const auth = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password, name) => api.post('/auth/register', { email, password, name }),
};

export const items = {
    getAll: (page = 1, search = '', filters = {}) => {
        const params = { page, limit: 50, search, ...filters };
        return api.get('/items', { params });
    },
    getBySku: (sku) => api.get(`/items/scan/${sku}`),
    getUnprinted: () => api.get('/items/unprinted'),
    markAsPrinted: (itemIds) => api.post('/items/mark-printed', { itemIds }),
    create: (data) => api.post('/items', data),
    update: (id, data) => api.put(`/items/${id}`, data),
    delete: (id) => api.delete(`/items/${id}`),
};

export const sales = {
    getAll: (page = 1) => api.get('/sales', { params: { page, limit: 50 } }),
    getById: (id) => api.get(`/sales/${id}`),
    checkout: (data) => api.post('/sales/checkout', data),
};

export const customers = {
    getAll: (page = 1, search = '') => api.get('/customers', { params: { page, limit: 50, search } }),
    create: (data) => api.post('/customers', data),
    update: (id, data) => api.put(`/customers/${id}`, data),
};

export const dashboard = {
    getStats: () => api.get('/dashboard/stats'),
    getSalesOverTime: () => api.get('/dashboard/sales-over-time'),
    getSalesByYear: () => api.get('/dashboard/sales-by-year'),
    getSalesByCategory: () => api.get('/dashboard/sales-by-category'),
    getPiecesByMetal: () => api.get('/dashboard/pieces-by-metal'),
    getTotalSalesStats: () => api.get('/dashboard/total-sales-stats'),
    getRecentSales: () => api.get('/dashboard/recent-sales'),
};

export const market = {
    getRates: async () => {
        try {
            const res = await api.get('/market/rates', { timeout: 10000 }); // 10s timeout for external API
            return res;
        } catch (error) {
            console.error("Failed to fetch market rates", error);
            // Return the error response so the caller can handle it
            if (error.response) {
                return error.response;
            }
            return { data: null };
        }
    }
};

export const shop = {
    getProfile: () => api.get('/shop'),
    updateProfile: (data) => api.put('/shop', data),
};

export default api;
