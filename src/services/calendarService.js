/**
 * Servicio de Calendario - ZonaGamer API
 * Gestión de eventos del calendario (Admin)
 * @version 1.0.0
 */

import { apiRequest } from './api.js';

const CALENDAR_ENDPOINTS = {
  BASE: '/calendar/eventos',
  PENDING: '/calendar/eventos/pendientes',
  RANGE: '/calendar/eventos/rango',
  UPCOMING: '/calendar/eventos/proximos',
  BY_ID: (id) => `/calendar/eventos/${id}`,
  COMPLETE: (id) => `/calendar/eventos/${id}/complete`,
  MARK_PENDING: (id) => `/calendar/eventos/${id}/pending`,
  STATS: '/calendar/stats',
};

/**
 * Crea un nuevo evento (Solo Admin)
 * @param {Object} eventData - Datos del evento
 * @returns {Promise<Object>} Evento creado
 */
const createEvent = async (eventData) => {
  return apiRequest(CALENDAR_ENDPOINTS.BASE, {
    method: 'POST',
    body: eventData,
  });
};

/**
 * Obtiene todos los eventos (Solo Admin)
 * @returns {Promise<Array>} Lista de eventos
 */
const getAllEvents = async () => {
  return apiRequest(CALENDAR_ENDPOINTS.BASE);
};

/**
 * Obtiene eventos pendientes (Solo Admin)
 * @returns {Promise<Array>} Lista de eventos pendientes
 */
const getPendingEvents = async () => {
  return apiRequest(CALENDAR_ENDPOINTS.PENDING);
};

/**
 * Obtiene eventos por rango de fechas (Solo Admin)
 * @param {string} start - Fecha inicio (ISO)
 * @param {string} end - Fecha fin (ISO)
 * @returns {Promise<Array>} Lista de eventos
 */
const getEventsByRange = async (start, end) => {
  return apiRequest(`${CALENDAR_ENDPOINTS.RANGE}?inicio=${start}&fin=${end}`);
};

/**
 * Obtiene próximos eventos (Solo Admin)
 * @param {number} days - Días hacia el futuro (default: 7)
 * @returns {Promise<Array>} Lista de eventos
 */
const getUpcomingEvents = async (days = 7) => {
  return apiRequest(`${CALENDAR_ENDPOINTS.UPCOMING}?days=${days}`);
};

/**
 * Obtiene un evento por ID (Solo Admin)
 * @param {string} id - ID del evento
 * @returns {Promise<Object>} Datos del evento
 */
const getEventById = async (id) => {
  return apiRequest(CALENDAR_ENDPOINTS.BY_ID(id));
};

/**
 * Actualiza un evento (Solo Admin)
 * @param {string} id - ID del evento
 * @param {Object} eventData - Datos actualizados
 * @returns {Promise<Object>} Evento actualizado
 */
const updateEvent = async (id, eventData) => {
  return apiRequest(CALENDAR_ENDPOINTS.BY_ID(id), {
    method: 'PUT',
    body: eventData,
  });
};

/**
 * Marca un evento como completado (Solo Admin)
 * @param {string} id - ID del evento
 * @returns {Promise<Object>} Evento actualizado
 */
const completeEvent = async (id) => {
  return apiRequest(CALENDAR_ENDPOINTS.COMPLETE(id), {
    method: 'PUT',
  });
};

/**
 * Marca un evento como pendiente (Solo Admin)
 * @param {string} id - ID del evento
 * @returns {Promise<Object>} Evento actualizado
 */
const markEventAsPending = async (id) => {
  return apiRequest(CALENDAR_ENDPOINTS.MARK_PENDING(id), {
    method: 'PUT',
  });
};

/**
 * Elimina un evento (Solo Admin)
 * @param {string} id - ID del evento
 * @returns {Promise<null>} Sin contenido
 */
const deleteEvent = async (id) => {
  return apiRequest(CALENDAR_ENDPOINTS.BY_ID(id), {
    method: 'DELETE',
  });
};

/**
 * Obtiene estadísticas del calendario (Solo Admin)
 * @returns {Promise<Object>} Estadísticas
 */
const getCalendarStats = async () => {
  return apiRequest(CALENDAR_ENDPOINTS.STATS);
};

export const CalendarService = {
  createEvent,
  getAllEvents,
  getPendingEvents,
  getEventsByRange,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  completeEvent,
  markEventAsPending,
  deleteEvent,
  getCalendarStats,
};

export default CalendarService;
