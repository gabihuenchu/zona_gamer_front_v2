/**
 * Configuración base para las peticiones al API de ZonaGamer usando Axios
 * @version 2.0.0
 */

import axios from 'axios';

// URL base configurable desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Instancia de Axios configurada
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de solicitud: Añade el token de autorización si existe
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    // Añadir token solo si parece JWT (evitar enviar 'local-token' al backend)
    if (isServerAuthToken(token)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuesta: Maneja errores globales y extrae datos
 */
api.interceptors.response.use(
  (response) => {
    // Axios devuelve la respuesta completa, aquí retornamos data directamente para compatibilidad
    // o manejamos casos como 204 No Content
    if (response.status === 204) return null;
    return response.data;
  },
  (error) => {
    // Normalizar el error para que coincida con lo que espera la app
    const customError = new Error(error.response?.data?.message || 'Error en la petición al servidor');
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.originalError = error;
    
    // Aquí podrías manejar 401 Unauthorized globalmente (ej. redirigir a login)
    if (error.response?.status === 401) {
      // Opcional: removeAuthToken(); window.location.href = '/login';
    }

    return Promise.reject(customError);
  }
);

// --- Funciones de utilidad para compatibilidad y manejo de tokens ---

/**
 * Obtiene el token JWT del almacenamiento local
 * @returns {string|null} Token JWT o null si no existe
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Verifica si el token parece ser un JWT válido (aprox) y no es un token local
 * @param {string|null} token
 * @returns {boolean}
 */
const isServerAuthToken = (token) => {
  if (!token) return false;
  if (token === 'local-token') return false;
  // Patrón básico de JWT: tres segmentos separados por puntos
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  return jwtPattern.test(token);
};

/**
 * Guarda el token JWT en el almacenamiento local
 * @param {string} token - Token JWT a guardar
 */
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Elimina el token JWT del almacenamiento local
 */
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Genera los headers para las peticiones HTTP (Mantenido por compatibilidad, aunque Axios lo maneja)
 * @param {boolean} requiresAuth - Si la petición requiere autenticación
 * @returns {Object} Headers de la petición
 */
const getHeaders = (requiresAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

/**
 * Realiza una petición HTTP al API (Wrapper sobre Axios para compatibilidad)
 * @param {string} endpoint - Endpoint del API (ej: '/auth/login')
 * @param {Object} options - Opciones de la petición (method, body, customHeaders)
 * @returns {Promise<any>} Datos de la respuesta
 */
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    customHeaders = {},
    // requiresAuth se ignora aquí porque el interceptor lo maneja, 
    // pero se mantiene en la firma por compatibilidad.
  } = options;

  const config = {
    method,
    url: endpoint,
    headers: customHeaders,
    data: body,
  };

  // La llamada a api(config) devuelve response.data gracias al interceptor
  return api(config);
};

// Exportaciones
export {
  API_BASE_URL,
  getAuthToken,
  isServerAuthToken,
  setAuthToken,
  removeAuthToken,
  getHeaders,
  apiRequest,
  api as default // Export default para uso directo de axios si se prefiere
};
