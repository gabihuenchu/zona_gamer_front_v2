import { useState, useEffect } from 'react';
import { fetchCategories } from '../../lib/api/productsApi';
import { productsCRUD } from '../../lib/api/productsCRUD';
import { ProductService } from '../../services/productService';
import { CategoryService } from '../../services/categoryService';

const ProductsManagement = () => {
    // Estados de modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Estados de datos
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({ total: 0, totalStock: 0 });
    
    // Estados de carga
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        price: '',
        stock: '',
        image: '',
        description: ''
    });

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const [productsData, categoriesData, statsData] = await Promise.all([
                productsCRUD.getAll(),
                fetchCategories(),
                productsCRUD.getStats()
            ]);

            setProducts(productsData);
            setCategories(categoriesData);
            setStats(statsData);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handlers del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            categoryId: '',
            price: '',
            stock: '',
            image: '',
            description: ''
        });
    };

    // CRUD Operations
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await productsCRUD.create(formData);
            await loadData();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            console.error(err)
            alert('Error al agregar producto');
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            categoryId: product.categoryId,
            price: product.price.toString(),
            stock: product.stock.toString(),
            image: product.imageUrl,
            description: product.description || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await productsCRUD.update(selectedProduct.id, formData);
            await loadData();
            setShowEditModal(false);
            setSelectedProduct(null);
            resetForm();
        } catch (err) {
            console.error(err)
            alert('Error al actualizar producto');
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleDeleteProduct = async () => {
        try {
            await productsCRUD.delete(selectedProduct.id);
            await loadData();
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } catch (err) {
            console.error(err)
            alert('Error al eliminar producto');
        }
    };

    // Helpers
    const getCategoryName = (categoryId) => {
        for (const cat of categories) {
            if (cat.id === categoryId) return cat.name;
            if (cat.children) {
                const child = cat.children.find(c => c.id === categoryId);
                if (child) return child.name;
            }
        }
        return 'Sin categoría';
    };

    const totalCategories = categories.reduce(
        (acc, cat) => acc + (cat.children ? cat.children.length : 1),
        0
    );

    const handleResetProducts = async () => {
        if (window.confirm('¿Estás seguro de que deseas resetear todos los productos a los valores por defecto?')) {
            try {
                await productsCRUD.reset();
                await loadData();
                alert('Productos reseteados exitosamente');
            } catch (err) {
                console.error(err)
                alert('Error al resetear productos');
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold !text-gray-800">Gestión de Productos</h2>
                    <p className="text-gray-500 mt-1">Administra tu catálogo de productos</p>
                </div>
                <div className="flex gap-3">
                    
                    <button
                        onClick={handleResetProducts}
                        className="inline-flex items-center !gap-2 !px-4 !py-2 bg-gray-500 text-white !rounded-xl hover:bg-gray-600 transition-all shadow-md font-medium"
                        title="Resetear productos a valores por defecto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Resetear
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-3 !px-6 !py-3 bg-blue-600 text-white !rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Agregar Producto</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 !gap-6">
                <div className="bg-white !rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-0">
                        <div className="w-16 bg-blue-50 flex items-center justify-center self-stretch">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div className="flex-1 !px-4 !py-6">
                            <p className="text-sm text-gray-500">Total Productos</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {isLoading ? '...' : stats.total}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-0">
                        <div className="w-16 bg-green-50 flex items-center justify-center self-stretch">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1 !px-4 !py-6">
                            <p className="text-sm text-gray-500">En Stock</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {isLoading ? '...' : stats.totalStock}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-0">
                        <div className="w-16 bg-purple-50 flex items-center justify-center self-stretch">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div className="flex-1 !px-4 !py-6">
                            <p className="text-sm text-gray-500">Categorías</p>
                            <p className="text-2xl font-bold text-gray-800">{totalCategories}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden !mt-8">
                {error && (
                    <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">{error}</div>
                )}

                {isLoading ? (
                    <div className="!p-12 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        Cargando productos...
                    </div>
                ) : products.length === 0 ? (
                    <div className="!p-12 text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium mb-2">No hay productos disponibles</p>
                        <p className="text-sm">Comienza agregando tu primer producto</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Producto</th>
                                    <th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Categoría</th>
                                    <th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Precio</th>
                                    <th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                                    <th className="!px-8 !py-4 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="!px-8 !py-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={product.imageUrl} 
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                />
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                {getCategoryName(product.categoryId)}
                                            </span>
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap text-gray-700 font-semibold">
                                            ${product.price?.toLocaleString('es-CL') || 'N/A'}
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                product.stock > 10
                                                    ? 'bg-green-100 text-green-800'
                                                    : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock} unidades
                                            </span>
                                        </td>
                                        <td className="!px-8 !py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Agregar Producto */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 !px-6 !py-4 flex justify-between items-center">
                            <h3 className="text-2xl font-bold !text-gray-800">Agregar Nuevo Producto</h3>
                            <button 
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="!text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddProduct} className="!p-6 !space-y-4">
                            <div>
                                <label className="block text-sm font-medium !text-gray-900 mb-2">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: Teclado Mecánico RGB"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium !text-gray-700 mb-2">Categoría *</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map(cat => (
                                        <optgroup key={cat.id} label={cat.name}>
                                            {cat.children ? (
                                                cat.children.map(child => (
                                                    <option key={child.id} value={child.id}>
                                                        {child.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={cat.id}>{cat.name}</option>
                                            )}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium !text-gray-700 mb-2">Precio *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="1"
                                        className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium !text-gray-700 mb-2">Stock *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium !text-gray-700 mb-2">URL de la Imagen</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium !text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe el producto..."
                                />
                            </div>

                            <div className="flex !gap-3 !pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white !py-2 !px-4 !rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Agregar Producto
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-200 !text-gray-700 !py-2 !px-4 !rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar Producto */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 !px-6 !py-4 flex justify-between items-center">
                            <h3 className="text-2xl font-bold !text-gray-800">Editar Producto</h3>
                            <button 
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedProduct(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateProduct} className="!p-6 !space-y-4">
                            <div>
                                <label className="block text-sm font-medium !text-gray-700 mb-2">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium !text-gray-700 mb-2">Categoría *</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map(cat => (
                                        <optgroup key={cat.id} label={cat.name}>
                                            {cat.children ? (
                                                cat.children.map(child => (
                                                    <option key={child.id} value={child.id}>
                                                        {child.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={cat.id}>{cat.name}</option>
                                            )}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium !text-gray-700 mb-2">Precio *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium !text-gray-700 mb-2">Stock *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium !text-gray-700 mb-2">URL de la Imagen</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium !text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full !px-4 !py-2 !text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex !gap-3 !pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white !py-2 !px-4 !rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedProduct(null);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-200 !text-gray-700 !py-2 !px-4 !rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Eliminación */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 !p-4">
                    <div className="bg-white !rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="!p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto !mb-4 bg-red-100 rounded-full">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-center !text-gray-800 mb-2">¿Eliminar producto?</h3>
                            <p className="text-center !text-gray-600 !mb-6">
                                ¿Estás seguro de que deseas eliminar <strong>{selectedProduct.name}</strong>? Esta acción no se puede deshacer.
                            </p>
                            
                            <div className="flex !gap-3">
                                <button
                                    onClick={handleDeleteProduct}
                                    className="flex-1 bg-red-600 text-white !py-2 !px-4 !rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Sí, eliminar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedProduct(null);
                                    }}
                                    className="flex-1 bg-gray-200 !text-gray-700 !py-2 !px-4 !rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsManagement;
