import express from "express";
import { CarritoDao } from "./dao/CarritoDao.js";
import { ProductoDao } from "../dao/ProductoDao.js";

const router = express.Router();
const carritoDao = new CarritoDao();
const productoDao = new ProductoDao(); // Agregar el DAO de Productos

// POST /api/carrito
router.post('/', async (_req, res) => {
    const newCart = await carritoDao.createCart();
    
    newCart
        ? res.status(200).json({"success": "Cart created with ID " + newCart._id})
        : res.status(500).json({"error": "there was an error"})
})

// DELETE /api/carrito/:id
router.delete('/:id', async(req,res) => {
    const { id } = req.params;
    const wasDeleted = await carritoDao.deleteCartById(id);
    
    wasDeleted 
        ? res.status(200).json({"success": "cart successfully removed"})
        : res.status(404).json({"error": "cart not found"})
})

// POST /api/carrito/:id/productos
router.post('/:id/productos', async(req,res) => {
    const { id } = req.params;
    const { body } = req;
    
    const productExists = await productoDao.exists(body.productId);
    
    if(productExists) {
        await carritoDao.saveProductToCart(id, body.productId); // Cambio en el argumento body.productId
        res.status(200).json({"success": "Product added to cart"});
    } else {
        res.status(404).json({"error": "product not found"});
    }
})

// GET /api/carrito/:id/productos
router.get('/:id/productos', async(req,res)=>{
    const { id } = req.params;
    const cartProducts = await carritoDao.getAllProductsFromCart(id);
    
    cartProducts
        ? res.status(200).json(cartProducts)
        : res.status(404).json({"error": "cart not found"})
})

// DELETE /api/carrito/:id/productos/:id_prod
router.delete('/:id/productos/:id_prod', async(req, res) => {
    const { id, id_prod } = req.params;
    
    const wasDeleted = await carritoDao.deleteProductFromCart(id, id_prod);
    
    wasDeleted 
        ? res.status(200).json({"success": "product removed from the cart"})
        : res.status(400).json({"error": "there was some problem"})
})

// PUT /api/carrito/:id
router.put('/:id', async(req, res) => {
    // Implementa el endpoint para actualizar productos en el carrito
    // Usar carritoDao.updateCart(id, productos) para actualizar el carrito
});

export default router;