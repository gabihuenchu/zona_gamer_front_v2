/**
 * Servicio de Carrito - ZonaGamer API
 * Gestión del carrito de compras
 * @version 1.0.0
 */

import { apiRequest } from './api.js';

const CART_ENDPOINTS = {
  BASE: '/cart',
  ADD: '/cart/add',
  ITEM: (productId) => `/cart/items/${productId}`,
};

/**
 * Obtiene el carrito del usuario actual
 * @returns {Promise<Object>} Datos del carrito
 */
const getCart = async () => {
  return apiRequest(CART_ENDPOINTS.BASE);
};

/**
 * Agrega un producto al carrito
 * @param {string} productId - ID del producto
 * @param {number} quantity - Cantidad a agregar
 * @returns {Promise<Object>} Carrito actualizado
 */
const addToCart = async (productId, quantity = 1) => {
  return apiRequest(CART_ENDPOINTS.ADD, {
    method: 'POST',
    body: { productId, quantity },
  });
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {string} productId - ID del producto
 * @param {number} quantity - Nueva cantidad
 * @returns {Promise<Object>} Carrito actualizado
 */
const updateCartItem = async (productId, quantity) => {
  return apiRequest(`${CART_ENDPOINTS.ITEM(productId)}?quantity=${quantity}`, {
    method: 'PUT',
  });
};

/**
 * Elimina un producto del carrito
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} Carrito actualizado
 */
const removeFromCart = async (productId) => {
  return apiRequest(CART_ENDPOINTS.ITEM(productId), {
    method: 'DELETE',
  });
};

/**
 * Vacía completamente el carrito
 * @returns {Promise<null>} Sin contenido
 */
const clearCart = async () => {
  return apiRequest(CART_ENDPOINTS.BASE, {
    method: 'DELETE',
  });
};

/**
 * Incrementa la cantidad de un producto en 1
 * @param {string} productId - ID del producto
 * @param {number} currentQuantity - Cantidad actual
 * @returns {Promise<Object>} Carrito actualizado
 */
const incrementItem = async (productId, currentQuantity) => {
  return updateCartItem(productId, currentQuantity + 1);
};

/**
 * Decrementa la cantidad de un producto en 1
 * @param {string} productId - ID del producto
 * @param {number} currentQuantity - Cantidad actual
 * @returns {Promise<Object>} Carrito actualizado
 */
const decrementItem = async (productId, currentQuantity) => {
  if (currentQuantity <= 1) {
    return removeFromCart(productId);
  }
  return updateCartItem(productId, currentQuantity - 1);
};

/**
 * Obtiene el número total de items en el carrito
 * @returns {Promise<number>} Total de items
 */
const getCartItemCount = async () => {
  try {
    const cart = await getCart();
    return cart.totalItems || 0;
  } catch {
    return 0;
  }
};

export const CartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  incrementItem,
  decrementItem,
  getCartItemCount,
};

export default CartService;
