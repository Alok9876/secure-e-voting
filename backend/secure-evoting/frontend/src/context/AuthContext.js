import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser  = localStorage.getItem('evoting_user');
    const savedToken = localStorage.getItem('evoting_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('evoting_token', token);
    localStorage.setItem('evoting_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('evoting_token');
    localStorage.removeItem('evoting_user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
