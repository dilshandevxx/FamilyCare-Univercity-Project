import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/users/profile');
          setUser(data);
          localStorage.setItem('fc_user', JSON.stringify(data));
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('fc_user');
          setUser(null);
        }
      } else {
        localStorage.removeItem('fc_user');
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    const { data } = await api.post('/auth/login', { email, password, role });
    localStorage.setItem('token', data.token);
    // Fetch full profile so user object has id, name, email, role
    const { data: profile } = await api.get('/users/profile');
    setUser(profile);
    localStorage.setItem('fc_user', JSON.stringify(profile));
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    if (data.user) {
      localStorage.setItem('fc_user', JSON.stringify(data.user));
    }
    return data;
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setUser(data);
      localStorage.setItem('fc_user', JSON.stringify(data));
    } catch {}
  };

  const googleLogin = async (googlePayload) => {
    const { data } = await api.post('/auth/google', googlePayload);
    localStorage.setItem('token', data.token);
    const { data: profile } = await api.get('/users/profile');
    setUser(profile);
    localStorage.setItem('fc_user', JSON.stringify(profile));
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
