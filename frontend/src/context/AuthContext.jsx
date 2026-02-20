import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Validate session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await api.get('/auth/me');
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (err) {
                console.log('Session validation failed or no session.');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Login handler
    const login = async (email, password) => {
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
        } catch (err) {
            console.error('Login error details:', err);
            let message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
            if (err.message === 'Network Error') {
                message = 'Unable to connect to server. Please check your internet or server status.';
            }
            setError(message);
            return { success: false, message };
        }
    };

    // Signup handler
    const signup = async (userData) => {
        setError(null);
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
        } catch (err) {
            console.error('Signup error details:', err);
            let message = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
            if (err.message === 'Network Error') {
                message = 'Unable to connect to server. Please check your internet or server status.';
            }
            setError(message);
            return { success: false, message };
        }
    };

    // Logout handler
    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            // Clear any other state if needed
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
