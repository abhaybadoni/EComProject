/**
 * Middleware functions to validate incoming requests
 */

export const validateProductQueryParams = (req, res, next) => {
    const { page, limit, minPrice, maxPrice, sort } = req.query;
    const errors = [];

    if (page !== undefined && page !== '') {
        const pageNum = Number(page);
        if (!Number.isInteger(pageNum) || pageNum < 1) {
            errors.push('Query parameter "page" must be a positive integer.');
        }
    }

    if (limit !== undefined && limit !== '') {
        const limitNum = Number(limit);
        if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
            errors.push('Query parameter "limit" must be an integer between 1 and 100.');
        }
    }

    if (minPrice !== undefined && minPrice !== '') {
        const min = Number(minPrice);
        if (isNaN(min) || min < 0) {
            errors.push('Query parameter "minPrice" must be a non-negative number.');
        }
    }

    if (maxPrice !== undefined && maxPrice !== '') {
        const max = Number(maxPrice);
        if (isNaN(max) || max < 0) {
            errors.push('Query parameter "maxPrice" must be a non-negative number.');
        }
    }

    if (minPrice !== undefined && maxPrice !== undefined && minPrice !== '' && maxPrice !== '') {
        const min = Number(minPrice);
        const max = Number(maxPrice);
        if (!isNaN(min) && !isNaN(max) && min > max) {
            errors.push('Query parameter "minPrice" cannot be greater than "maxPrice".');
        }
    }

    const allowedSorts = ['newest', 'price_asc', 'price_desc', 'rating_desc', 'title_asc', 'title_desc'];
    if (sort !== undefined && sort !== '' && !allowedSorts.includes(sort)) {
        errors.push(`Query parameter "sort" must be one of: ${allowedSorts.join(', ')}.`);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: errors
        });
    }

    next();
};

export const validateProductId = (req, res, next) => {
    const { id } = req.params;
    const numId = Number(id);

    if (!Number.isInteger(numId) || numId <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: ['Product ID must be a positive integer.']
        });
    }

    next();
};
