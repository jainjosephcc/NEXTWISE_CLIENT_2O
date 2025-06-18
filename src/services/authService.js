// src/services/authService.js
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import apiClient from "@/services/apiService.js";

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        const { client, token } = response.data.result;

        // Store user data and auth token in local storage
        localStorage.setItem('userData', JSON.stringify(client));
        localStorage.setItem('authToken', token);

        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            throw new Error('User is not logged in');
        }

        const payload = { user_id: userData.id };
        await apiClient.post('/logout', payload);

        // Clear localStorage on logout
        localStorage.clear();

        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};


// New function for registration
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);

        // On successful registration, extract user data and auth token from the response
        const { client, token } = response.data.result;

        // Store user data and auth token in local storage
        localStorage.setItem('userData', JSON.stringify(client));
        localStorage.setItem('authToken', token);

        return response.data;
    } catch (error) {
        // Handle registration errors
        if (error.response && error.response.data) {
            console.error('Registration failed:', error.response.data.message);
        } else {
            console.error('Registration failed:', error.message);
        }
        throw error;
    }
};

export const resetPassword = async (payload) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/profile/password-reset`, payload);
        return response.data;
    } catch (error) {
        console.error('Password reset failed:', error);
        throw error;
    }
};
