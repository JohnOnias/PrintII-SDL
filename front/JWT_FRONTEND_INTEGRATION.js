// Exemplo de integração JWT no Frontend React/Vue

// ============================================
// 1. CONFIGURAR AXIOS COM INTERCEPTORES
// ============================================

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para renovar token quando expirar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${API_BASE_URL}/usuarios/token/refresh`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // Refresh token falhou, fazer logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ============================================
// 2. SERVIÇO DE AUTENTICAÇÃO
// ============================================

import api from './axiosConfig';

export const authService = {
  // Registrar novo usuário
  register: (userData) =>
    api.post('/usuarios/register', userData),

  // Login
  login: (email, password) =>
    api.post('/usuarios/login', { email, password }),

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario');
  },

  // Verificar se está autenticado
  isAuthenticated: () =>
    !!localStorage.getItem('access_token'),

  // Obter dados do usuário
  getUser: () =>
    JSON.parse(localStorage.getItem('usuario') || 'null'),

  // Fazer requisição autenticada
  request: (method, url, data = null) => {
    if (method.toLowerCase() === 'get') {
      return api.get(url);
    } else if (method.toLowerCase() === 'post') {
      return api.post(url, data);
    } else if (method.toLowerCase() === 'put') {
      return api.put(url, data);
    } else if (method.toLowerCase() === 'delete') {
      return api.delete(url);
    }
  },
};

// ============================================
// 3. COMPONENTE DE LOGIN (React)
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      
      // Armazenar tokens e dados do usuário
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

      // Redirecionar para dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

// ============================================
// 4. CONTEXT DE AUTENTICAÇÃO (React)
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário autenticado ao carregar
    const user = authService.getUser();
    if (user) {
      setUsuario(user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    setUsuario(response.data.usuario);
    return response.data;
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ============================================
// 5. ROTA PROTEGIDA (React)
// ============================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Uso:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>

// ============================================
// 6. EXEMPLO DE USO EM HOOKS CUSTOMIZADOS
// ============================================

import { useState, useEffect } from 'react';
import api from '@/services/axiosConfig';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(url)
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// Uso:
// const { data: usuarios, loading, error } = useFetch('/usuarios/all');
