/**
 * Servicio de Carrito - ZonaGamer API
 * Gestión del carrito de compras
 * @version 2.0.0
 */

import { apiRequest } from './api.js';
import { ProductService } from './productService.js';

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
  const response = await apiRequest(CART_ENDPOINTS.BASE);
  const cart = normalizeCart(response);
  return await enrichCart(cart);
};

/**
 * Agrega un producto al carrito
 * @param {string} productId - ID del producto
 * @param {number} quantity - Cantidad a agregar
 * @returns {Promise<Object>} Carrito actualizado
 */
const addToCart = async (productId, quantity = 1) => {
  const response = await apiRequest(CART_ENDPOINTS.ADD, {
    method: 'POST',
    body: { productId, quantity },
  });
  const cart = normalizeCart(response);
  return await enrichCart(cart);
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {string} productId - ID del producto
 * @param {number} quantity - Nueva cantidad
 * @returns {Promise<Object>} Carrito actualizado
 */
const updateCartItem = async (productId, quantity) => {
  const qty = parseInt(quantity, 10);
  if (Number.isNaN(qty) || qty < 1) {
    throw new Error('Cantidad inválida');
  }
  const response = await apiRequest(`${CART_ENDPOINTS.ITEM(productId)}?quantity=${qty}`, {
    method: 'PUT',
  });
  const cart = normalizeCart(response);
  return await enrichCart(cart);
};

/**
 * Elimina un producto del carrito
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} Carrito actualizado
 */
const removeFromCart = async (productId) => {
  const response = await apiRequest(CART_ENDPOINTS.ITEM(productId), {
    method: 'DELETE',
  });
  const cart = normalizeCart(response);
  return await enrichCart(cart);
};

/**
 * Vacía completamente el carrito
 * @returns {Promise<Object>} Carrito vacío
 */
const clearCart = async () => {
  await apiRequest(CART_ENDPOINTS.BASE, {
    method: 'DELETE',
  });
  return { items: [], totalItems: 0, totalPrice: 0 };
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

/**
 * Normaliza la respuesta del backend para el frontend
 * @param {Object} cartData - Datos del carrito del backend
 * @returns {Object} Carrito normalizado
 */
const normalizeCart = (cartData) => {
  if (!cartData) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  // ✅ Normalizar items del carrito
  const items = (cartData.items || []).map(item => ({
    // IDs
    productId: item.productId || item.id,
    cartItemId: item.cartItemId || item.id,
    
    // Información del producto (mapeo español → inglés)
    name: item.productName || item.nombreProducto || item.name,
    price: item.precio || item.price,
    imageUrl: item.imageUrl || item.imagenUrl,
    description: item.descripcion || item.description,
    
    // Cantidad y subtotal
    quantity: item.quantity || item.cantidad || 1,
    subtotal: item.subtotal,
    disponibilidad: item.disponibilidad,
  }));

  return {
    cartId: cartData.id || cartData.cartId,
    userId: cartData.userId || cartData.usuarioId,
    items,
    totalItems: cartData.totalItems || 0,
    totalPrice: (cartData.total != null ? cartData.total : cartData.totalPrice) || 0,
    subtotal: cartData.subtotal || 0,
    iva: cartData.iva || 0,
  };
};

const enrichCart = async (cart) => {
  try {
    const items = await Promise.all((cart.items || []).map(async (item) => {
      const needs = !item.name || item.price == null || item.subtotal == null || !item.imageUrl;
      if (!needs) return item;
      try {
        const p = await ProductService.getProductById(item.productId);
        const price = p.precio != null ? p.precio : p.price != null ? p.price : item.price || 0;
        const quantity = item.quantity || 1;
        return {
          ...item,
          name: item.name || p.nombreProducto || p.name || 'Producto',
          price,
          imageUrl: item.imageUrl || p.imageUrl || p.imagenUrl || '',
          description: item.description || p.descripcion || p.description,
          subtotal: item.subtotal != null ? item.subtotal : price * quantity,
        };
      } catch {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        return { ...item, name: item.name || 'Producto', subtotal: item.subtotal != null ? item.subtotal : price * quantity };
      }
    }));
    const totalItems = items.reduce((s, it) => s + (it.quantity || 0), 0);
    const totalPrice = items.reduce((s, it) => s + (Number(it.subtotal || 0)), 0);
    return { ...cart, items, totalItems: totalItems || cart.totalItems || 0, totalPrice: totalPrice || cart.totalPrice || 0 };
  } catch {
    return cart;
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
