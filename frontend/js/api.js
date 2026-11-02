/**
 * Aurora Market API Service
 * Handles all communication with the Express/Node.js REST backend
 */

const API_BASE_URL = window.location.origin;

export const api = {
    /**
     * Fetch products with search, filter, sort and pagination parameters
     */
    async getProducts({ search = '', category = '', minPrice = '', maxPrice = '', inStock = false, sort = 'newest', page = 1, limit = 12 } = {}) {
        const params = new URLSearchParams();

        if (search && search.trim()) params.append('search', search.trim());
        if (category && category !== 'all') params.append('category', category);
        if (minPrice !== '' && !isNaN(minPrice)) params.append('minPrice', minPrice);
        if (maxPrice !== '' && !isNaN(maxPrice)) params.append('maxPrice', maxPrice);
        if (inStock) params.append('inStock', 'true');
        if (sort) params.append('sort', sort);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);

        const url = `${API_BASE_URL}/api/products?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Fetch single product details with gallery images and specs
     */
    async getProductById(id) {
        const url = `${API_BASE_URL}/api/products/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Fetch all available product categories with item counts
     */
    async getCategories() {
        const url = `${API_BASE_URL}/api/categories`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Check backend API health status
     */
    async getHealth() {
        const url = `${API_BASE_URL}/api/health`;
        const response = await fetch(url);
        return await response.json();
    }
};

export default api;
