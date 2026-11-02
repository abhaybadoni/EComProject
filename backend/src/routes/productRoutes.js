import { getProducts, getProductById, getProductBySlug } from '../controllers/productController.js';
import { validateProductQueryParams, validateProductId } from '../middlewares/requestValidator.js';

/**
 * Register Product routes on the given router/app
 */
export function registerProductRoutes(router) {
    router.get('/api/products', validateProductQueryParams, getProducts);
    router.get('/api/products/:id', validateProductId, getProductById);
    router.get('/api/products/slug/:slug', getProductBySlug);
}

export default registerProductRoutes;
