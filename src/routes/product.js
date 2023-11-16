router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? 'price' : sort === 'desc' ? '-price' : null,
        query: query || {},
    };

    try {
        const products = await productoDao.getAll(options);
        const totalProducts = await productoDao.count(query);

        const totalPages = Math.ceil(totalProducts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        const prevLink = hasPrevPage ? `/api/productos?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/api/productos?page=${nextPage}&limit=${limit}` : null;

        res.status(200).json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});