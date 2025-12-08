import { useEffect, useState } from 'react';
import { ProductService } from '../services/productService';
import { productsCRUD } from '../lib/api/productsCRUD';

// Encapsula carga y filtrado por categorías seleccionadas
export function useProducts(selectedCategoryIds = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const local = await productsCRUD.getAll();
        if (!mounted) return;
        const normalizedLocal = Array.isArray(local)
          ? local.map((prod) => ({
              id: prod.id,
              name: prod.name,
              description: prod.description || '',
              price: prod.price || 0,
              imageUrl: prod.imageUrl || '',
              categoryId: prod.categoryId || null,
              isFeatured: !!prod.isFeatured,
              stock: prod.stock || 0,
            }))
          : [];
        const filteredLocal =
          selectedCategoryIds.length > 0
            ? normalizedLocal.filter((prod) => prod.categoryId && selectedCategoryIds.includes(prod.categoryId))
            : normalizedLocal;
        setData(filteredLocal);
        setLoading(false);
      } catch (error) {
        console.error(error)
      }
    })();

    ProductService.getAllProducts()
      .then((products) => {
        if (!mounted) return;
        const normalized = Array.isArray(products)
          ? products.map((prod) => ({
              id: prod.id ?? prod.productoId ?? prod.productId ?? prod._id ?? String(Math.random()),
              name: prod.name ?? prod.nombreProducto ?? prod.title ?? 'Producto',
              description: prod.description ?? prod.descripcion ?? '',
              price: prod.price ?? prod.precio ?? 0,
              imageUrl: prod.imageUrl ?? prod.imagenUrl ?? '',
              categoryId: prod.categoryId ?? prod.categoriaId ?? prod.category?.id ?? null,
              isFeatured: prod.isFeatured ?? prod.destacado ?? false,
              stock: prod.stock ?? 0,
            }))
          : [];
        const filtered =
          selectedCategoryIds.length > 0
            ? normalized.filter((prod) => prod.categoryId && selectedCategoryIds.includes(prod.categoryId))
            : normalized;
        setData(filtered);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e);
      });

    return () => {
      mounted = false;
    };
  }, [selectedCategoryIds]);

  return { products: data, loading, error };
}
