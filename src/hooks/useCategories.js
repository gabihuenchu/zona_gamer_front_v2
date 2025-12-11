import { useState, useEffect } from 'react';
import { CategoryService } from '../services/categoryService';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await CategoryService.getAllCategories();

                // Asegurar que cada categoría tenga el campo 'children'
                const categoriesWithChildren = data.map(cat => ({
                    id: cat.id,
                    nombreCategoria: cat.nombreCategoria,
                    parentId: cat.parentId,
                    active: cat.active,
                    children: [] // Campo necesario para el acordeón
                }));

                setCategories(categoriesWithChildren);
                setError(null);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
                setError(err.message);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};