import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, fetchProfile } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('quanly-token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('quanly-token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      localStorage.setItem('quanly-token', data.token);
      localStorage.setItem('quanly-user', JSON.stringify(data.user));
      setUser(data.user);
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('quanly-token');
    localStorage.removeItem('quanly-user');
    setUser(null);
  };

  const clearError = () => setError('');

  return (
    <AuthContext.Provider value={{ user, login, logout, error, clearError, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
