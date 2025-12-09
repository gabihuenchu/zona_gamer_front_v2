import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import { UserService } from '../services/userService'
import { CartService } from '../services/cartService'
import { LocalCart } from '../lib/cart/localCart'
import { getAuthToken, isServerAuthToken } from '../services/api'

export default function CheckoutPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState({ totalItems: 0, totalPrice: 0 })
    const [formData, setFormData] = useState({
        address: '',
        notes: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            // 1. Cargar Usuario
            let currentUser = null
            try {
                // Intentar API
                const profile = await UserService.getMyProfile()
                if (profile) currentUser = profile
            } catch {
                // Fallo API, intentar local
            }

            if (!currentUser) {
                const localData = localStorage.getItem('userData')
                if (localData) currentUser = JSON.parse(localData)
            }

            if (!currentUser) {
                navigate('/login')
                return
            }

            setUser(currentUser)
            setFormData(prev => ({ ...prev, address: currentUser.address || '' }))

            // 2. Cargar Carrito (solo para el resumen)
            const token = getAuthToken()
            const useServer = isServerAuthToken(token)
            const c = useServer ? await CartService.getCart() : await LocalCart.getCart()
            const items = Array.isArray(c.items) ? c.items : []
            const totalPrice = c.totalPrice || items.reduce((s, i) => s + (Number(i.price || 0) * (i.quantity || 0)), 0)
            const totalItems = c.totalItems || items.reduce((s, i) => s + (i.quantity || 0), 0)
            
            if (totalItems === 0) {
                navigate('/carrito') // No se puede hacer checkout de carrito vacío
                return
            }
            
            setCart({ items, totalItems, totalPrice })

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleConfirmOrder = async () => {
        if (!formData.address.trim()) {
            alert("Por favor ingresa una dirección de envío")
            return
        }

        // Aquí iría la lógica real de crear la orden
        // Por ahora simulamos éxito
        
        // Opcional: Actualizar dirección del usuario si cambió
        if (user.id && formData.address !== user.address) {
             try {
                const token = getAuthToken()
                const useServer = isServerAuthToken(token)
                if (useServer) {
                    await UserService.updateMyProfile({ address: formData.address })
                }
                const updatedUser = { ...user, address: formData.address }
                localStorage.setItem('userData', JSON.stringify(updatedUser))
             } catch (e) {
                 console.error("No se pudo actualizar la dirección del perfil", e)
             }
        }

        alert("¡Pedido realizado con éxito!\n\nGracias por tu compra.")
        
        // Vaciar carrito
        const token = getAuthToken()
        const useServer = isServerAuthToken(token)
        if (useServer) await CartService.clearCart()
        else await LocalCart.clearCart()

        navigate('/')
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="pc-builder min-h-screen">
                <main className="max-w-7xl mx-auto px-4 pt-6 pb-8 grid gap-8 lg:grid-cols-[1fr_380px]">
                    
                    {/* Columna Izquierda: Datos de Envío */}
                    <section className="bg-white rounded-lg border shadow-sm p-6 text-black">
                        <h1 className="text-2xl font-semibold text-black mb-6 border-bottom !p-6 !pb-3">Finalizar Compra</h1>
                    
                    <div className="!p-6 mb-6">
                        <h2 className="text-lg font-medium text-black mb-4">Datos de Contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border rounded bg-gray-100 text-gray-600" 
                                    value={user.name || ''} 
                                    readOnly 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border rounded bg-gray-100 text-gray-600" 
                                    value={user.email || ''} 
                                    readOnly 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="!p-6 !mb-6">
                        <h2 className="text-lg font-medium text-black !mb-4">Información de Envío</h2>
                        <div className="!mb-4">
                            <label className="block text-sm font-medium text-gray-700 !mb-1">Dirección de Entrega <span className="text-red-500">*</span></label>
                            <textarea 
                                name="address"
                                className="w-full p-3 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black"
                                rows="3"
                                placeholder="Calle, número, departamento, comuna..."
                                value={formData.address}
                                onChange={handleChange}
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">Asegúrate de que la dirección sea correcta para el envío.</p>
                        </div>

                        <div className="!mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas del Pedido (Opcional)</label>
                            <textarea 
                                name="notes"
                                className="w-full p-3 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black"
                                rows="3"
                                placeholder="Instrucciones especiales para la entrega, comentarios..."
                                value={formData.notes}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>
                </section>

                {/* Columna Derecha: Resumen de Orden */}
                <aside className="h-fit space-y-6 !p-6">
                    <div className="bg-white rounded-lg border shadow-sm p-6 text-black !p-6">
                        <h2 className="text-lg font-semibold text-black !p-6 !mb-4">Resumen del Pedido</h2>
                        
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.items?.map((item, idx) => (
                                <div key={idx} className="flex gap-3 text-sm">
                                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden border">
                                        <img 
                                            src={item.imageUrl || item.product?.imageUrl} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 line-clamp-1">{item.name || item.product?.name}</p>
                                        <p className="text-gray-500">Cant: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-medium">
                                        ${((item.price || item.product?.price || 0) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cart.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span>Gratis</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-black pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>${cart.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            className="w-full mt-6 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all active:scale-[0.98]"
                            onClick={handleConfirmOrder}
                        >
                            Confirmar Pedido
                        </button>
                        
                        <button 
                            className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm underline"
                            onClick={() => navigate('/carrito')}
                        >
                            Volver al Carrito
                        </button>
                    </div>
                </aside>
            </main>
            </div>
        </div>
    )
}
