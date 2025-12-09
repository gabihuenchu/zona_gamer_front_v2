/**
 * Servicio de Autenticación - ZonaGamer API
 * Maneja registro, login y verificación de sesión
 * @version 1.0.0
 */

import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from './api.js';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  HEALTH: '/auth/health',
};

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario
 * @param {string} userData.email - Correo electrónico
 * @param {string} userData.password - Contraseña
 * @param {string} userData.nombre - Nombre del usuario
 * @param {string} userData.apellido - Apellido del usuario
 * @param {string} userData.numeroDeTelefono - Número de teléfono
 * @returns {Promise<Object>} Datos del usuario registrado con token
 */
const register = async (userData) => {
  const response = await apiRequest(AUTH_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: userData,
    requiresAuth: false,
  });

  if (response.token) {
    setAuthToken(response.token);
    localStorage.setItem('userData', JSON.stringify(response));
  }

  return response;
};

/**
 * Inicia sesión de un usuario
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Correo electrónico
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<Object>} Datos del usuario con token
 */
const login = async (credentials) => {
  const response = await apiRequest(AUTH_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: credentials,
    requiresAuth: false,
  });

  if (response.token) {
    setAuthToken(response.token);
    localStorage.setItem('userData', JSON.stringify(response));
  }

  return response;
};

/**
 * Cierra la sesión del usuario actual
 */
const logout = () => {
  removeAuthToken();
  localStorage.removeItem('userData');
};

/**
 * Verifica si hay una sesión activa
 * @returns {boolean} True si hay sesión activa
 */
const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Obtiene los datos del usuario almacenados localmente
 * @returns {Object|null} Datos del usuario o null
 */
const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Verifica si el usuario actual es administrador
 * @returns {boolean} True si es administrador
 */
const isAdmin = () => {
  const user = getCurrentUser();
  const role = user?.rol || user?.role;
  return role === 'ROLE_ADMIN' || role === 'admin' || user?.isAdmin === true || user?.admin === true;
};

/**
 * Verifica el estado del servicio de autenticación
 * @returns {Promise<string>} Mensaje de estado del servicio
 */
const checkAuthHealth = async () => {
  return apiRequest(AUTH_ENDPOINTS.HEALTH, {
    requiresAuth: false,
  });
};

export const AuthService = {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  isAdmin,
  checkAuthHealth,
};

export default AuthService;
