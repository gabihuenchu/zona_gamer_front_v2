import { useState } from "react";

function CategoryItem({ category, selected, onToggleCategory, isChild = false }) {
    const active = selected.includes(category.id);
    
    return (
        <label
            className={`flex items-center gap-2. 5 cursor-pointer text-sm rounded-md px-3 py-2 transition-colors hover:bg-gray-700/40 ${
                isChild ? 'ml-4' : ''
            }`}
        >
            <input
                type="checkbox"
                checked={active}
                onChange={() => onToggleCategory(category.id)}
                className="
                    appearance-none w-5 h-5
                    rounded-lg
                    border-2 border-gray-500
                    bg-gray-700
                    grid place-content-center
                    transition-colors duration-200
                    checked:bg-blue-600 checked:border-blue-600
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                    after:content-['✓'] after:text-[10px] after:font-bold after:text-white
                    after:opacity-0 checked:after:opacity-100
                "
            />
            <span className="flex-1 text-gray-900 font-medium">
                {isChild && '↳ '}
                {category. nombreCategoria}
            </span>
        </label>
    );
}

function ParentItem({ cat, selected, onToggleCategory }) {
    const [open, setOpen] = useState(true);
    
    // ✅ Validación robusta
    const hasChildren = cat.children && Array.isArray(cat.children) && cat.children.length > 0;
    const hasSelected = hasChildren && cat.children.some(child => selected.includes(child.id));

    // Si NO tiene hijos, renderizar como categoría simple
    if (! hasChildren) {
        return <CategoryItem category={cat} selected={selected} onToggleCategory={onToggleCategory} />;
    }

    // Si tiene hijos, renderizar como acordeón
    return (
        <div className="border-b border-neutral-100 last:border-b-0">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center justify-between py-3 px-2 text-sm font-semibold rounded-md transition-colors hover:bg-neutral-50 ${
                    hasSelected ?  'text-emerald-700' : 'text-neutral-800'
                }`}
                aria-expanded={open}
                aria-controls={`panel-${cat.id}`}
            >
                <span className="flex items-center gap-2">
                    {cat.nombreCategoria}
                    {hasSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${open ? 'rotate-180' :  ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                id={`panel-${cat.id}`}
                hidden={!open}
                className="pl-3 pr-2 pb-3 space-y-1.5 animate-in fade-in-from-top-2"
            >
                {cat.children.map((child) => (
                    <CategoryItem
                        key={child.id}
                        category={child}
                        selected={selected}
                        onToggleCategory={onToggleCategory}
                        isChild={true}
                    />
                ))}
            </div>
        </div>
    );
}

export default function CategoryAccordion({ categories, selected, onToggleCategory }) {
    return (
        <nav aria-label="Categorías" className="space-y-1">
            {categories.map((c) => (
                <ParentItem
                    key={c. id}
                    cat={c}
                    selected={selected}
                    onToggleCategory={onToggleCategory}
                />
            ))}
        </nav>
    );
}
