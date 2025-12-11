import { useEffect, useState } from 'react';
import { ProductService } from '../services/productService';

// Encapsula carga y filtrado por categorías seleccionadas
export function useProducts(selectedCategoryIds = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    ProductService.getAllProducts()
      .then((products) => {
        if (!mounted) return;
        const normalized = Array.isArray(products)
          ? products.map((prod) => ({
              id: prod.id ?? prod.productId ?? prod._id ?? String(Math.random()),
              name: prod.name ?? prod.nombreProducto ?? 'Producto',
              description: prod.description ?? prod.descripcion ?? '',
              price: prod.price ?? prod.precio ?? 0,
              imageUrl: prod.imageUrl ?? prod.imagenUrl ?? '',
              categoryId: prod.categoryId ?? prod.categoriaId ?? null,
              isFeatured: !!prod.isFeatured,
              stock: prod.stock ?? 0,
            }))
          : [];
        const filtered =
          selectedCategoryIds.length > 0
            ? normalized.filter((prod) => prod.categoryId && selectedCategoryIds.includes(prod.categoryId))
            : normalized;
        setData(filtered);
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedCategoryIds]);

  return { products: data, loading, error };
}
