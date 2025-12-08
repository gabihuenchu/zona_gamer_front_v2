const STORAGE_KEY = 'products_local';

/**
 * Servicio CRUD completo para productos con persistencia en localStorage
 */
class ProductsCRUDService {
    constructor() {
        this.initialized = false;
    }

    /**
     * Inicializa el storage con datos de la API si no existen productos locales
     */
    async initialize() {
        if (this.initialized) return;

        const localProducts = localStorage.getItem(STORAGE_KEY);
        
        if (!localProducts) {
            // Importa productos iniciales desde la API mock
            const { fetchProducts } = await import('./productsApi');
            const initialProducts = await fetchProducts();
            this.saveToStorage(initialProducts);
        }

        this.initialized = true;
    }

    /**
     * Obtiene todos los productos (READ)
     */
    async getAll() {
        await this.initialize();
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const products = this.getFromStorage();
                resolve(products);
            }, 300); // Simula latencia de red
        });
    }

    /**
     * Obtiene un producto por ID
     */
    async getById(id) {
        const products = await this.getAll();
        return products.find(p => p.id === id) || null;
    }

    /**
     * Crea un nuevo producto (CREATE)
     */
    async create(productData) {
        await this.initialize();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const products = this.getFromStorage();
                    
                    // Genera ID único
                    const newProduct = {
                        id: Date.now().toString(),
                        name: productData.name,
                        categoryId: productData.categoryId,
                        price: parseFloat(productData.price),
                        stock: parseInt(productData.stock) || 0,
                        imageUrl: productData.image || 'https://via.placeholder.com/300',
                        description: productData.description || '',
                        isFeatured: false,
                        createdAt: new Date().toISOString()
                    };

                    const updatedProducts = [...products, newProduct];
                    this.saveToStorage(updatedProducts);
                    
                    resolve(newProduct);
                } catch (error) {
                    console.error(error)
                    reject(new Error('Error al crear producto'));
                }
            }, 400);
        });
    }

    /**
     * Actualiza un producto existente (UPDATE)
     */
    async update(id, productData) {
        await this.initialize();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const products = this.getFromStorage();
                    const index = products.findIndex(p => p.id === id);

                    if (index === -1) {
                        reject(new Error('Producto no encontrado'));
                        return;
                    }

                    const updatedProduct = {
                        ...products[index],
                        name: productData.name,
                        categoryId: productData.categoryId,
                        price: parseFloat(productData.price),
                        stock: parseInt(productData.stock) || 0,
                        imageUrl: productData.image || products[index].imageUrl,
                        description: productData.description || '',
                        updatedAt: new Date().toISOString()
                    };

                    products[index] = updatedProduct;
                    this.saveToStorage(products);
                    
                    resolve(updatedProduct);
                } catch (error) {
                    console.error(error)
                    reject(new Error('Error al actualizar producto'));
                }
            }, 400);
        });
    }

    /**
     * Elimina un producto (DELETE)
     */
    async delete(id) {
        await this.initialize();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const products = this.getFromStorage();
                    const filteredProducts = products.filter(p => p.id !== id);

                    if (products.length === filteredProducts.length) {
                        reject(new Error('Producto no encontrado'));
                        return;
                    }

                    this.saveToStorage(filteredProducts);
                    resolve({ success: true, id });
                } catch (error) {
                    console.error(error)
                    reject(new Error('Error al eliminar producto'));
                }
            }, 300);
        });
    }

    /**
     * Obtiene estadísticas de productos
     */
    async getStats() {
        const products = await this.getAll();
        
        return {
            total: products.length,
            totalStock: products.reduce((acc, p) => acc + (p.stock || 0), 0),
            lowStock: products.filter(p => p.stock < 10).length,
            outOfStock: products.filter(p => p.stock === 0).length
        };
    }

    /**
     * Lee productos desde localStorage
     */
    getFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al leer productos del storage:', error);
            return [];
        }
    }

    /**
     * Guarda productos en localStorage
     */
    saveToStorage(products) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        } catch (error) {
            console.error('Error al guardar productos en storage:', error);
        }
    }

    /**
     * Resetea los productos a los valores iniciales de la API
     */
    async reset() {
        const { fetchProducts } = await import('./productsApi');
        const initialProducts = await fetchProducts();
        this.saveToStorage(initialProducts);
        return initialProducts;
    }
}

// Exporta una instancia única (singleton)
export const productsCRUD = new ProductsCRUDService();
