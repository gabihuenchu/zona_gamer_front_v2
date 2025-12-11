import { CartService } from '../../services/cartService'

export default function ProductCard({ product }) {
    const priceValue = typeof product?.price === 'number' ? product.price : Number(product?.price) || 0
    const priceText = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(priceValue)
    async function handleBuy() {
        const id = product?.id || product?._id || product?.productId
        if (!id) return
        try {
            await CartService.addToCart(id, 1)
        } catch {
            alert("No se pudo añadir al carrito")
        }
        alert("Producto añadido correctamente")
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
                <p className="text-lg font-semibold">{priceText}</p>
                {product?.description ? <p>{product.description}</p> : null}
                <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={handleBuy}>Comprar</button>
                </div>
            </div>
        </div>
    );
}
