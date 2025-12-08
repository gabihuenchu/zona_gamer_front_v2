/**
 * Servicio de Productos - ZonaGamer API
 * Gestión del catálogo de productos
 * @version 1.0.0
 */

import { apiRequest } from './api.js';

const PRODUCT_ENDPOINTS = {
  BASE: '/products',
  BY_ID: (id) => `/products/${id}`,
  BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
  FEATURED: '/products/featured',
  SEARCH: '/products/search',
  LOW_STOCK: '/products/low-stock',
};

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} Lista de productos
 */
const getAllProducts = async () => {
  return apiRequest(PRODUCT_ENDPOINTS.BASE, { requiresAuth: false });
};

/**
 * Obtiene un producto por su ID
 * @param {string} id - ID del producto
 * @returns {Promise<Object>} Datos del producto
 */
const getProductById = async (id) => {
  return apiRequest(PRODUCT_ENDPOINTS.BY_ID(id), { requiresAuth: false });
};

/**
 * Obtiene productos por categoría
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<Array>} Lista de productos de la categoría
 */
const getProductsByCategory = async (categoryId) => {
  return apiRequest(PRODUCT_ENDPOINTS.BY_CATEGORY(categoryId), { requiresAuth: false });
};

/**
 * Obtiene productos destacados
 * @returns {Promise<Array>} Lista de productos destacados
 */
const getFeaturedProducts = async () => {
  return apiRequest(PRODUCT_ENDPOINTS.FEATURED, { requiresAuth: false });
};

/**
 * Busca productos por término
 * @param {string} searchTerm - Término de búsqueda (mínimo 2 caracteres)
 * @returns {Promise<Array>} Lista de productos encontrados
 * @throws {Error} Si el término tiene menos de 2 caracteres
 */
const searchProducts = async (searchTerm) => {
  if (searchTerm.length < 2) {
    throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
  }
  return apiRequest(`${PRODUCT_ENDPOINTS.SEARCH}?q=${encodeURIComponent(searchTerm)}`, { requiresAuth: false });
};

/**
 * Crea un nuevo producto (Solo Admin)
 * @param {Object} productData - Datos del producto
 * @param {string} productData.nombreProducto - Nombre del producto
 * @param {string} productData.descripcion - Descripción
 * @param {number} productData.precio - Precio
 * @param {number} productData.stock - Stock disponible
 * @param {string} productData. categoriaId - ID de la categoría
 * @param {string} productData. imageUrl - URL de la imagen
 * @param {boolean} productData.destacado - Si es producto destacado
 * @returns {Promise<Object>} Producto creado
 */
const createProduct = async (productData) => {
  return apiRequest(PRODUCT_ENDPOINTS.BASE, {
    method: 'POST',
    body: productData,
  });
};

/**
 * Actualiza un producto existente (Solo Admin)
 * @param {string} id - ID del producto
 * @param {Object} productData - Datos actualizados
 * @returns {Promise<Object>} Producto actualizado
 */
const updateProduct = async (id, productData) => {
  return apiRequest(PRODUCT_ENDPOINTS.BY_ID(id), {
    method: 'PUT',
    body: productData,
  });
};

/**
 * Elimina un producto (Solo Admin)
 * @param {string} id - ID del producto
 * @returns {Promise<null>} Sin contenido
 */
const deleteProduct = async (id) => {
  return apiRequest(PRODUCT_ENDPOINTS.BY_ID(id), {
    method: 'DELETE',
  });
};

/**
 * Obtiene productos con bajo stock (Solo Admin)
 * @param {number} threshold - Umbral de stock (default: 10)
 * @returns {Promise<Array>} Lista de productos con bajo stock
 */
const getLowStockProducts = async (threshold = 10) => {
  return apiRequest(`${PRODUCT_ENDPOINTS.LOW_STOCK}?threshold=${threshold}`);
};

export const ProductService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
};

export default ProductService;
