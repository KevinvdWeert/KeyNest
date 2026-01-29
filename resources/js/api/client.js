import axios from 'axios';

let cachedCsrfToken = null;

async function refreshCsrfToken() {
    // Prefer the token embedded in the Blade layout when available.
    const metaToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    if (metaToken) {
        cachedCsrfToken = metaToken;
        // Still ensure the XSRF-TOKEN cookie exists (Sanctum expects this flow for SPAs).
        try {
            await axios.get('/sanctum/csrf-cookie', {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
        } catch {
            // If Sanctum isn't available for some reason, the meta token is still a valid fallback.
        }

        return cachedCsrfToken;
    }

    // SPA default: establish session + XSRF-TOKEN cookie.
    await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    // Optional fallback: get an explicit token for X-CSRF-TOKEN header.
    try {
        const response = await axios.get('/csrf-token', {
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        cachedCsrfToken = response.data?.token ?? null;
    } catch {
        cachedCsrfToken = null;
    }

    return cachedCsrfToken;
}

// Create axios instance
const apiClient = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Add CSRF token to requests
apiClient.interceptors.request.use(async (config) => {
    // Keep sending a token even for API calls in SPA routes.
    if (!cachedCsrfToken) {
        try {
            await refreshCsrfToken();
        } catch {
            // If we can't fetch a token, let the request proceed; Laravel will respond with 419.
        }
    }

    const tokenToSend = cachedCsrfToken
        ?? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (tokenToSend) {
        config.headers['X-CSRF-TOKEN'] = tokenToSend;
    }

    return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If CSRF token is out of sync (new session, expired cookies, etc.), refresh once and retry.
        if (error.response?.status === 419 && error.config && !error.config.__retried419) {
            error.config.__retried419 = true;
            return refreshCsrfToken()
                .then(() => apiClient(error.config));
        }

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
        await refreshCsrfToken();
        const response = await apiClient.post('/login', { email, password });
        return response.data;
    },

    async register(name, email, password, password_confirmation) {
        await refreshCsrfToken();
        const response = await apiClient.post('/register', { 
            name, 
            email, 
            password, 
            password_confirmation 
        });
        return response.data;
    },

    async logout() {
        await refreshCsrfToken();
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
