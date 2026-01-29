import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Add CSRF token to requests
apiClient.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

// API service functions
export const authService = {
    async login(email, password) {
        const response = await apiClient.post('/login', { email, password });
        return response.data;
    },

    async register(name, email, password, password_confirmation) {
        const response = await apiClient.post('/register', { 
            name, 
            email, 
            password, 
            password_confirmation 
        });
        return response.data;
    },

    async logout() {
        const response = await apiClient.post('/logout');
        return response.data;
    },

    async getUser() {
        const response = await apiClient.get('/api/user');
        return response.data;
    },
};

export const vaultService = {
    async getItems() {
        const response = await apiClient.get('/api/vault');
        return response.data;
    },

    async createItem(data) {
        const response = await apiClient.post('/api/vault', data);
        return response.data;
    },

    async updateItem(id, data) {
        const response = await apiClient.put(`/api/vault/${id}`, data);
        return response.data;
    },

    async deleteItem(id) {
        const response = await apiClient.delete(`/api/vault/${id}`);
        return response.data;
    },
};

export const billingService = {
    async getSubscription() {
        const response = await apiClient.get('/billing');
        return response.data;
    },

    async createCheckoutSession(plan) {
        const response = await apiClient.get(`/billing/checkout/${plan}`);
        return response.data;
    },

    async cancelSubscription() {
        const response = await apiClient.post('/billing/cancel');
        return response.data;
    },

    async getPortalUrl() {
        const response = await apiClient.get('/billing/portal');
        return response.data;
    },
};
