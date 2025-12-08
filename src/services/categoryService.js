/**
 * Servicio de Categorías - ZonaGamer API
 * Gestión de categorías de productos
 * @version 1.0.0
 */

import { apiRequest } from './api.js';

const CATEGORY_ENDPOINTS = {
  BASE: '/categorias',
  ROOT: '/categorias/root',
  BY_ID: (id) => `/categorias/${id}`,
  CHILDREN: (id) => `/categorias/${id}/hija`,
};

/**
 * Obtiene todas las categorías
 * @returns {Promise<Array>} Lista de categorías
 */
const getAllCategories = async () => {
  return apiRequest(CATEGORY_ENDPOINTS.BASE, { requiresAuth: false });
};

/**
 * Obtiene las categorías raíz (sin padre)
 * @returns {Promise<Array>} Lista de categorías raíz
 */
const getRootCategories = async () => {
  return apiRequest(CATEGORY_ENDPOINTS.ROOT, { requiresAuth: false });
};

/**
 * Obtiene una categoría por su ID
 * @param {string} id - ID de la categoría
 * @returns {Promise<Object>} Datos de la categoría
 */
const getCategoryById = async (id) => {
  return apiRequest(CATEGORY_ENDPOINTS.BY_ID(id), { requiresAuth: false });
};

/**
 * Obtiene las subcategorías de una categoría
 * @param {string} parentId - ID de la categoría padre
 * @returns {Promise<Array>} Lista de subcategorías
 */
const getSubcategories = async (parentId) => {
  return apiRequest(CATEGORY_ENDPOINTS.CHILDREN(parentId), { requiresAuth: false });
};

/**
 * Crea una nueva categoría (Solo Admin)
 * @param {Object} categoryData - Datos de la categoría
 * @param {string} categoryData.nombreCategoria - Nombre de la categoría
 * @param {string} categoryData. descripcion - Descripción
 * @param {string|null} categoryData. parentCategoriaId - ID del padre (opcional)
 * @param {number} categoryData.orden - Orden de visualización
 * @returns {Promise<Object>} Categoría creada
 */
const createCategory = async (categoryData) => {
  return apiRequest(CATEGORY_ENDPOINTS.BASE, {
    method: 'POST',
    body: categoryData,
  });
};

/**
 * Actualiza una categoría existente (Solo Admin)
 * @param {string} id - ID de la categoría
 * @param {Object} categoryData - Datos actualizados
 * @returns {Promise<Object>} Categoría actualizada
 */
const updateCategory = async (id, categoryData) => {
  return apiRequest(CATEGORY_ENDPOINTS.BY_ID(id), {
    method: 'PUT',
    body: categoryData,
  });
};

/**
 * Elimina una categoría (Solo Admin)
 * @param {string} id - ID de la categoría
 * @returns {Promise<null>} Sin contenido
 */
const deleteCategory = async (id) => {
  return apiRequest(CATEGORY_ENDPOINTS.BY_ID(id), {
    method: 'DELETE',
  });
};

/**
 * Obtiene el árbol completo de categorías
 * @returns {Promise<Array>} Árbol de categorías con subcategorías anidadas
 */
const getCategoryTree = async () => {
  const rootCategories = await getRootCategories();
  
  const buildTree = async (categories) => {
    const tree = [];
    for (const category of categories) {
      const children = await getSubcategories(category.categoriaId);
      tree.push({
        ...category,
        subcategorias: children.length > 0 ? await buildTree(children) : [],
      });
    }
    return tree;
  };

  return buildTree(rootCategories);
};

export const CategoryService = {
  getAllCategories,
  getRootCategories,
  getCategoryById,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
};

export default CategoryService;
