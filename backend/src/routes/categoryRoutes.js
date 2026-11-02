import { getCategories, getCategoryById } from '../controllers/categoryController.js';

/**
 * Register Category routes on the given router/app
 */
export function registerCategoryRoutes(router) {
    router.get('/api/categories', getCategories);
    router.get('/api/categories/:id', getCategoryById);
}

export default registerCategoryRoutes;
