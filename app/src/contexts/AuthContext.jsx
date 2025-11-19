import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    // --- LOGIN ---
    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            setUser({ token: access_token });
            return { success: true };
        } catch (err) {
            console.error("Error en login:", err);
            return { 
                success: false, 
                error: err.response?.data?.error || "Error al iniciar sesión" 
            };
        }
    };

    // --- REGISTRO (NUEVO) ---
    const register = async (nombre, email, password) => {
        try {
            // Llamada al backend: POST /api/auth/register
            await apiClient.post('/auth/register', { 
                nombre, 
                email, 
                password 
            });
            return { success: true };
        } catch (err) {
            console.error("Error en registro:", err);
            return { 
                success: false, 
                error: err.response?.data?.error || "Error al registrarse" 
            };
        }
    };

    // --- LOGOUT ---
    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        login,
        register, // ¡Exportamos la nueva función!
        logout,
        loading,
        isLoggedIn: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);