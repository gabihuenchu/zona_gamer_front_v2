/**
 * Servicio de Health Check - ZonaGamer API
 * Verifica el estado del backend
 * @version 1.0.0
 */

import { apiRequest } from './api.js';

const HEALTH_ENDPOINTS = {
  GENERAL: '/health',
};

/**
 * Verifica el estado general del backend
 * @returns {Promise<Object>} Estado del servicio
 */
const checkHealth = async () => {
  return apiRequest(HEALTH_ENDPOINTS.GENERAL, {
    requiresAuth: false,
  });
};

/**
 * Verifica si el backend está disponible
 * @returns {Promise<boolean>} True si el backend está disponible
 */
const isBackendAvailable = async () => {
  try {
    const response = await checkHealth();
    return response.status === 'UP';
  } catch {
    return false;
  }
};

export const HealthService = {
  checkHealth,
  isBackendAvailable,
};

export default HealthService;
