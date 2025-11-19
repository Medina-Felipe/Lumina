import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../utils/apiClient'; 
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('access_token')); 
    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const data = await AuthService.login(email, password);
            
            localStorage.setItem('access_token', data.access_token);
            setToken(data.access_token);
            
        } catch (err){
            throw err; 
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        setToken(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);