import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gem-track-f38d-5jdmxw674-siddhanth-raikars-projects.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
  getTotalSalesStats: () => api.get('/dashboard/total-sales-stats'),
};

export const market = {
  getRates: () => api.get('/market/rates'),
};
