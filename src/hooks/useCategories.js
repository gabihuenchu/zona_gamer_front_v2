import { useEffect, useState } from 'react';
import { CategoryService } from '../services/categoryService';
import { fetchCategories } from '../lib/api/productsApi';

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

    (async () => {
      try {
        const cats = await fetchCategories();
        if (!mounted) return;
        const normalized = Array.isArray(cats)
          ? cats.map((c) => ({ id: c.id, name: c.name, children: c.children || [] }))
          : [];
        setData(normalized);
        setLoading(false);
      } catch (error) {
        console.error(error)
      }
    })();

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
