import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import { CartService } from '../services/cartService'
import { ProductService } from '../services/productService'
import { UserService } from '../services/userService'
import { LocalCart } from '../lib/cart/localCart'
import { getAuthToken } from '../services/api'

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 })
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  async function loadCart() {
    setLoading(true)
    setError(null)
    try {
      const useServer = !!getAuthToken()
      const c = useServer ? await CartService.getCart() : await LocalCart.getCart()
      const items = Array.isArray(c.items) ? c.items : []
      const immediate = { items, totalItems: c.totalItems || items.reduce((s, i) => s + (i.quantity || 0), 0), totalPrice: c.totalPrice || items.reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 0)), 0) }
      setCart(immediate)
      setLoading(false)

      const enriched = await Promise.all(
        items.map(async (it) => {
          const hasBasics = it.name && typeof it.price !== 'undefined' && it.imageUrl
          if (hasBasics) return it
          try {
            const p = await ProductService.getProductById(it.productId)
            return { ...it, name: it.name || p.name, price: typeof it.price !== 'undefined' ? it.price : p.price, imageUrl: it.imageUrl || p.imageUrl, product: p }
          } catch {
            return it
          }
        })
      )
      setCart({ items: enriched, totalItems: immediate.totalItems, totalPrice: enriched.reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 0)), 0) })
      
    } catch (e) {
      setError(e)
      setLoading(false)
    }
  }

  async function loadProfile() {
    try {
      const me = await UserService.getMyProfile()
      setProfile(me)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadProfile()
    loadCart()
    const toastMsg = location.state && location.state.toast
    if (toastMsg) {
      setToast(toastMsg)
      setTimeout(() => setToast(null), 2500)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  async function increment(productId, quantity) {
    const useServer = !!getAuthToken()
    if (useServer) await CartService.incrementItem(productId, quantity)
    else await LocalCart.updateItem(productId, quantity + 1)
    await loadCart()
  }

  async function decrement(productId, quantity) {
    const useServer = !!getAuthToken()
    if (useServer) await CartService.decrementItem(productId, quantity)
    else await LocalCart.updateItem(productId, quantity - 1)
    await loadCart()
  }

  async function removeItem(productId) {
    const useServer = !!getAuthToken()
    if (useServer) await CartService.removeFromCart(productId)
    else await LocalCart.removeItem(productId)
    await loadCart()
  }

  async function clearAll() {
    const useServer = !!getAuthToken()
    if (useServer) await CartService.clearCart()
    else await LocalCart.clearCart()
    await loadCart()
  }

  const isEmpty = useMemo(() => !loading && cart.items.length === 0, [loading, cart.items.length])

  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-6 pb-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Carrito de compras</h1>
            {cart.totalItems > 0 ? (
              <button className="btn btn-outline-danger" onClick={clearAll}>Vaciar</button>
            ) : null}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="spinner-border" role="status" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-sm text-neutral-600">No se pudo cargar el carrito</p>
              <button className="btn btn-primary" onClick={loadCart}>Reintentar</button>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-neutral-700">Tu carrito está vacío</p>
              <button className="btn btn-primary" onClick={() => navigate('/productos')}>Explorar productos</button>
            </div>
          ) : (
            <ul className="divide-y">
              {cart.items.map((it) => {
                const p = it.product || {}
                const name = it.name || p.name || 'Producto'
                const description = it.description || p.description || ''
                const price = typeof it.price === 'number' ? it.price : p.price || 0
                const imageUrl = it.imageUrl || p.imageUrl
                const quantity = it.quantity || 0
                const subtotal = price * quantity
                const needsEnrich = (!it.name || typeof it.price === 'undefined' || !it.imageUrl || !it.description) && !error
                return (
                  <li key={it.productId} className="py-4 flex gap-4 items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">Sin imagen</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{name}</p>
                      {description ? (
                        <p className="text-sm text-neutral-600">{description}</p>
                      ) : (
                        <p className="text-sm text-neutral-500">Cargando descripción...</p>
                      )}
                      {needsEnrich ? (
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="spinner-border spinner-border-sm" />
                          <span className="text-xs text-neutral-500">Completando detalles...</span>
                        </div>
                      ) : null}
                      <p className="text-sm text-neutral-600">${price?.toFixed ? price.toFixed(2) : Number(price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-outline-secondary" onClick={() => decrement(it.productId, quantity)}>-</button>
                      <span className="px-3">{quantity}</span>
                      <button className="btn btn-outline-secondary" onClick={() => increment(it.productId, quantity)}>+</button>
                    </div>
                    <div className="w-24 text-right">${subtotal.toFixed(2)}</div>
                    <button className="btn btn-outline-danger" onClick={() => removeItem(it.productId)}>Eliminar</button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <aside className="bg-white rounded-lg border shadow-sm p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3">Resumen</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Items</span>
            <span className="font-medium">{cart.totalItems}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">Total</span>
            <span className="font-semibold">${cart.totalPrice?.toFixed ? cart.totalPrice.toFixed(2) : Number(cart.totalPrice).toFixed(2)}</span>
          </div>
          {profile ? (
            <button className="btn btn-primary w-100">Proceder al pago</button>
          ) : (
            <button className="btn btn-outline-primary w-100" onClick={() => navigate('/login')}>Inicia sesión para comprar</button>
          )}
        </aside>
      </main>
      {toast ? (
        <div style={{ position: 'fixed', top: '90px', right: '16px', zIndex: 1000 }}>
          <div className="alert alert-success" role="alert">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  )
}
