import { useEffect, useState } from 'react';
import { CategoryService } from '../services/categoryService';

// Carga de categorías (una sola vez)
export function useCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const mapTree = (nodes) =>
      (nodes || []).map((n) => ({
        id: n.id ?? n.categoriaId ?? n.categoryId ?? n._id ?? String(Math.random()),
        name: n.name ?? n.nombreCategoria ?? n.title ?? 'Categoría',
        children: mapTree(n.children ?? n.subcategorias ?? []),
      }));

    

    CategoryService.getCategoryTree()
      .then((tree) => {
        if (!mounted) return;
        const normalized = Array.isArray(tree) ? mapTree(tree) : [];
        setData(normalized);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { categories: data, loading, error };
}
