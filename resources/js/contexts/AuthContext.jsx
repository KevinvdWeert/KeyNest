import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Check if user is already authenticated on mount
        const checkAuth = async () => {
            try {
                // Try to get user from Laravel's window.Laravel object first
                if (window.Laravel?.user) {
                    setUser(window.Laravel.user);
                    setInitialized(true);
                } else {
                    // Otherwise fetch from API
                    const userData = await authService.getUser();
                    setUser(userData);
                    setInitialized(true);
                }
            } catch (error) {
                // User is not authenticated
                setUser(null);
                setInitialized(true);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            if (response.user) {
                setUser(response.user);
            } else {
                // Fetch user after successful login
                const userData = await authService.getUser();
                setUser(userData);
            }
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await authService.register(name, email, password, password_confirmation);
            if (response.user) {
                setUser(response.user);
            } else {
                // Fetch user after successful registration
                const userData = await authService.getUser();
                setUser(userData);
            }
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed',
                errors: error.response?.data?.errors || {}
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
        loading,
        initialized,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
