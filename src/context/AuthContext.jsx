import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // Importa la URL base

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    if (token && userId && username) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ 
        id: userId, 
        username: username 
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('username', res.data.user.username);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser({ 
        id: res.data.user.id, 
        username: res.data.user.username 
      });
      
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, username) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password, username });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('username', res.data.user.username);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser({ 
        id: res.data.user.id, 
        username: res.data.user.username 
      });
      
      return res.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
