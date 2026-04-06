import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMe } from '../lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: 'buyer' | 'seller' | 'admin';
    likedAssets: string[];
    purchasedAssets: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('puppet_token');
            if (token) {
                try {
                    const userData = await fetchMe();
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to restore session', err);
                    localStorage.removeItem('puppet_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('puppet_token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('puppet_token');
        setUser(null);
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
