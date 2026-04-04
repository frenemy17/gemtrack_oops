'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../utils/api';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                setUser({ token });
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const { data } = await auth.login(email, password);
            localStorage.setItem('token', data.token);
            setUser({ token: data.token });
            router.push('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (email, password, name) => {
        try {
            const { data } = await auth.register(email, password, name);
            localStorage.setItem('token', data.token);
            setUser({ token: data.token });
            router.push('/dashboard');
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
