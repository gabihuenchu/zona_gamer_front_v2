import { CartService } from '../../services/cartService'
import { useNavigate } from 'react-router-dom'
import { LocalCart } from '../../lib/cart/localCart'
import { getAuthToken } from '../../services/api'

export default function ProductCard({ product }) {
    const navigate = useNavigate()
    async function handleBuy() {
        const id = product?.id || product?._id || product?.productId
        if (!id) return
        try {
            const useServer = !!getAuthToken()
            if (useServer) {
                await CartService.addToCart(id, 1)
            } else {
                await LocalCart.addItem(id, 1, {
                    name: product?.name,
                    price: product?.price,
                    imageUrl: product?.imageUrl,
                    description: product?.description,
                })
            }
        } catch {
            await LocalCart.addItem(id, 1, {
                name: product?.name,
                price: product?.price,
                imageUrl: product?.imageUrl,
                description: product?.description,
            })
        }
        navigate('/carrito', { state: { toast: `Agregado: ${product?.name || 'Producto'}` } })
    }
    return (
        <div className="card bg-base-100 w-full shadow-sm">
            <figure>
                <img
                    src={product?.imageUrl}
                    alt={product?.name || 'Producto'}
                    loading="lazy"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{product?.name}</h2>
                {product?.description ? <p>{product.description}</p> : null}
                <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={handleBuy}>Comprar</button>
                </div>
            </div>
        </div>
    );
}
