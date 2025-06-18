// src/services/apiService.js
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

// Create an instance of axios with the base URL and default headers
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in headers
apiClient.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => {
        return response; // If the response is successful, return it
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Token expired or invalid. Logging out...');
            localStorage.clear();
            sessionStorage.clear();
            // Prevent multiple redirects
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error); // Reject other errors
    }
);

export const fetchCountries = async () => {
    const response = await apiClient.get('/countries');
    return response.data.country_list;
};

export default apiClient;
