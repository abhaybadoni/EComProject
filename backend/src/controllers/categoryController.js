import Category from '../models/Category.js';

export const getCategories = (req, res, next) => {
    try {
        const categories = Category.getAll();
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = (req, res, next) => {
    try {
        const { id } = req.params;
        const category = Category.getById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category Not Found',
                message: `Category with ID ${id} was not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};
