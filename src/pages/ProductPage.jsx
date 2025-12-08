import { useMemo, useState } from "react";
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductService } from '../services/productService';
import { CategoryService } from '../services/categoryService';
import FeaturedProducts from "../components/Products/FeaturedProducts";
import ProductGrid from '../components/Products/ProductGrid';
import CategoryAccordion from "../components/Products/CategoryAccordion";
import ProductFilterBar from "../components/Products/ProductFilterBar";
import Navbar from "../components/Navbar/Navbar";



export default function ProductPage() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('featured');

    const { products, loading } = useProducts(selectedCategories);
    const { categories, loading: loadingCats } = useCategories();

    // DESTACADOS ARRIBA
    const featured = useMemo(
        () => products.filter((p) => p.isFeatured),
        [products]
    );

    const processed = useMemo(() => {
        let list = [...products];

        if (search.trim()) {
            const term = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(term) ||
                    (p.description || '').toLowerCase().includes(term)
            );
        }

        switch (sort) {
            case 'price-asc':
                list.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                list.sort((a, b) => b.price - a.price);
                break;
            case 'alpha':
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'featured':
                list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
                break;
        }

        return list;
    }, [products, search, sort]);

    function toggleCategory(id) {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    }

    return (
        <div>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6 grid gap-8 lg:grid-cols-[240px_1fr] p-3">
                <aside className="bg-white rounded-lg border shadow-sm p-4 lg:sticky lg:top-24 h-fit max-h-[calc(100vh - 7rem)] overflow-y-auto text-gray-900">
                    <h2 className="text-lg font-bold mb-4 pb-2 border-b border-neutral-300">
                        Categorías
                    </h2>
                    {loadingCats ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-sm text-neutral-500">Cargando categorías...</p>
                        </div>
                    ) : (
                        <CategoryAccordion
                            categories={categories}
                            selected={selectedCategories}
                            onToggleCategory={toggleCategory}
                        />
                    )}
                </aside>

                <section >
                    {featured.length > 0 && (
                        <FeaturedProducts products={featured} />
                    )}
                    <ProductFilterBar
                        search={search}
                        onSearchChange={setSearch}
                        sort={sort}
                        onSortChange={setSort}
                    />
                    <ProductGrid products={processed} loading={loading} />
                </section>
            </main>
        </div>
    );
}
