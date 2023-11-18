import express from 'express';
import { ProductoDao } from './dao/ProductoDao.js';

const PORT = 1234;
const app = express();
const productoDao = new ProductoDao(); // Instancia del nuevo DAO

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/productos', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
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
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productoDao.getProductById(id);
        product ? res.status(200).json(product) : res.status(404).json({ error: 'Product not found' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/productos', async (req, res) => {
    // Lógica para crear un nuevo producto usando el DAO actualizado
});

app.put('/api/productos/:id', async (req, res) => {
    // Lógica para actualizar un producto usando el DAO actualizado
});

app.delete('/api/productos/:id', async (req, res) => {
    // Lógica para eliminar un producto usando el DAO actualizado
});

const server = app.listen(PORT, () => {
    console.log(` >>>>> 🚀 Server started at http://localhost:${PORT}`)
});

server.on('error', (err) => console.log(err));