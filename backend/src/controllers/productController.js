import Product from '../models/Product.js';

export const getProducts = (req, res, next) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            inStock,
            sort,
            page,
            limit
        } = req.query;

        const result = Product.find({
            search,
            category,
            minPrice,
            maxPrice,
            inStock,
            sort,
            page,
            limit
        });

        res.status(200).json({
            success: true,
            count: result.products.length,
            pagination: result.pagination,
            data: result.products
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = (req, res, next) => {
    try {
        const { id } = req.params;
        const product = Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product Not Found',
                message: `Product with ID ${id} does not exist.`
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

export const getProductBySlug = (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = Product.findBySlug(slug);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product Not Found',
                message: `Product with slug '${slug}' does not exist.`
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};
