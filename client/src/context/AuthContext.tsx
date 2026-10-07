import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('skillpath_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('skillpath_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('skillpath_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('skillpath_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Failed to hydrate existing session:', err);
          localStorage.removeItem('skillpath_token');
          localStorage.removeItem('skillpath_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('skillpath_token', res.token);
      localStorage.setItem('skillpath_user', JSON.stringify(res.user));
    }
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('skillpath_token', res.token);
      localStorage.setItem('skillpath_user', JSON.stringify(res.user));
    }
  };

  const logout = () => {
    localStorage.removeItem('skillpath_token');
    localStorage.removeItem('skillpath_user');
    setUser(null);
    setToken(null);
  };

  const updateUser = async (updatedData: Partial<User>) => {
    const res = await api.updateMe(updatedData);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('skillpath_user', JSON.stringify(res.user));
    }
  };

  const refreshUser = async () => {
    if (token) {
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('skillpath_user', JSON.stringify(res.user));
      }
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
