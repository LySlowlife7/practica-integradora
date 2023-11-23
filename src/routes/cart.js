import express from "express";
import { CarritoDao } from "./dao/CarritoDao.js";
import { ProductoDao } from "../dao/ProductoDao.js";

const router = express.Router();
const carritoDao = new CarritoDao();
const productoDao = new ProductoDao();

// POST /api/carrito
router.post('/', async (_req, res) => {
    const newCart = await carritoDao.createCart();
    
    newCart
        ? res.status(200).json({ "success": `Cart created with ID ${newCart._id}` })
        : res.status(500).json({ "error": "There was an error" });
});

// DELETE /api/carrito/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const wasDeleted = await carritoDao.deleteCartById(id);
    
    wasDeleted 
        ? res.status(200).json({ "success": "Cart successfully removed" })
        : res.status(404).json({ "error": "Cart not found" });
});

// POST /api/carrito/:id/productos
router.post('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    
    const productExists = await productoDao.exists(body.productId);
    
    if (productExists) {
        await carritoDao.saveProductToCart(id, body.productId);
        res.status(200).json({ "success": "Product added to cart" });
    } else {
        res.status(404).json({ "error": "Product not found" });
    }
});

// GET /api/carrito/:id/productos
router.get('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const cartProducts = await carritoDao.getAllProductsFromCart(id).populate('products');
    
    cartProducts
        ? res.status(200).json(cartProducts)
        : res.status(404).json({ "error": "Cart not found" });
});

// DELETE /api/carrito/:id/productos/:id_prod
router.delete('/:id/productos/:id_prod', async (req, res) => {
    const { id, id_prod } = req.params;
    
    const wasDeleted = await carritoDao.deleteProductFromCart(id, id_prod);
    
    wasDeleted 
        ? res.status(200).json({ "success": "Product removed from the cart" })
        : res.status(400).json({ "error": "There was some problem" });
});

// PUT /api/carrito/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const updated = await carritoDao.updateCart(id, body.products);

    updated
        ? res.status(200).json({ "success": "Cart updated successfully" })
        : res.status(400).json({ "error": "There was an issue updating the cart" });
});

// PUT /api/carrito/:id/productos/:id_prod
router.put('/:id/productos/:id_prod', async (req, res) => {
    const { id, id_prod } = req.params;
    const { body } = req;

    const updated = await carritoDao.updateProductQuantity(id, id_prod, body.quantity);

    updated
        ? res.status(200).json({ "success": "Product quantity updated successfully" })
        : res.status(400).json({ "error": "There was an issue updating the product quantity" });
});

// DELETE /api/carrito/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const cleared = await carritoDao.clearCart(id);

    cleared
        ? res.status(200).json({ "success": "Cart cleared successfully" })
        : res.status(400).json({ "error": "There was an issue clearing the cart" });
});

export default router;