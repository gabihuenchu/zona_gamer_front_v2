const STORAGE_KEY = 'local_cart'

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : { items: [] }
    const items = Array.isArray(data.items) ? data.items : []
    const totalItems = items.reduce((s, i) => s + (i.quantity || 0), 0)
    const totalPrice = items.reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 0)), 0)
    return { items, totalItems, totalPrice }
  } catch {
    return { items: [], totalItems: 0, totalPrice: 0 }
  }
}

const write = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: cart.items || [] }))
  } catch (error) {
    console.error(error)
  }
}

const getCart = async () => read()

const addItem = async (productId, quantity = 1, details = {}) => {
  const cart = read()
  const idx = cart.items.findIndex((it) => it.productId === productId)
  if (idx >= 0) {
    cart.items[idx].quantity = (cart.items[idx].quantity || 0) + quantity
  } else {
    cart.items.push({ productId, quantity, ...details })
  }
  write(cart)
  return read()
}

const updateItem = async (productId, quantity) => {
  const cart = read()
  const idx = cart.items.findIndex((it) => it.productId === productId)
  if (idx >= 0) {
    cart.items[idx].quantity = quantity
    if (quantity <= 0) cart.items.splice(idx, 1)
    write(cart)
  }
  return read()
}

const removeItem = async (productId) => {
  const cart = read()
  const idx = cart.items.findIndex((it) => it.productId === productId)
  if (idx >= 0) {
    cart.items.splice(idx, 1)
    write(cart)
  }
  return read()
}

const clearCart = async () => {
  write({ items: [] })
  return read()
}

const getItemCount = async () => read().totalItems

export const LocalCart = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  getItemCount,
}

export default LocalCart
