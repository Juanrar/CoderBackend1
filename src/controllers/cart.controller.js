import { CartModel } from '../models/cart.model.js';
import { CartDao } from '../dao/cart.dao.js';

const CartService = new CartDao(CartModel);

export class CartController{
    static async create(req, res){
        try{
            const newCart = await CartService.create({ products: [] })
            res.status(201).json({status: "success", payload: newCart})
        }catch(error){
            res.status(500).json({status:"error", payload: "Error interno del servidor"})
        }
    }

    static async getAll(req, res){
        try{
            const response = await CartService.getAll()
            res.status(200).json({status: "success", payload: response})

        }catch(error){
            res.status(500).json({ status: "error", payload: "Error interno del servidor" });
        }
    }

    static async getById(req, res){
        const { cid } = req.params
        try{
            const response = await CartService.getPopulatedById(cid)
            if (!response ){
                return res.status(404).json({status: "fail", payload: "Carrito no encontrado"})
            }
            res.status(200).json({status: "success", payload: response})
        }catch(error){
            if(error.name === "CastError"){
                return res.status(400).json({ status: "error", payload: "Formato no ID invalido"})
            }

            res.status(500).json({ status: "error", payload: "Error interno del servidor" })
        }
    }


    static async addProduct(req, res){
        const { cid, pid } = req.params
        try{
            const cart = await CartService.getById(cid)
            if (!cart) {
                return res.status(404).json({ status: "fail", payload: "Carrito no encontrado" });
            }
            const productIndex = cart.products.findIndex(p => p.product.toString() === pid)

            if (productIndex !== -1){
                cart.products[productIndex].quantity++;
            }else {
                cart.products.push({product: pid, quantity: 1});
            }

            const updatedCart =  await CartService.update(cid, cart)
            res.status(200).json({ status: "success", payload: updatedCart });
        }catch(error){
            if (error.name === "CastError") {
                return res.status(400).json({ status: "error", payload: "Formato de ID inválido (Carrito o Producto)" });
            }
            console.error("Error al agregar producto al carrito:", error);
            res.status(500).json({ status: "error", payload: "Error interno del servidor" });
        }
    }

    static async removeProduct(req, res){
        const { cid, pid } = req.params
        try{
            const cart = await CartService.getById(cid)
            if (!cart) {
                return res.status(404).json({ status: "fail", payload: "Carrito no encontrado" });
            }

            cart.products = cart.products.filter(p => p.product.toString() !== pid);

            const updatedCart =  await CartService.update(cid, cart)
            res.status(200).json({ status: "success", payload: updatedCart });
        }catch(error){
            if (error.name === "CastError") {
                return res.status(400).json({ status: "error", payload: "Formato de ID inválido (Carrito o Producto)" });
            }
            console.error("Error al agregar producto al carrito:", error);
            res.status(500).json({ status: "error", payload: "Error interno del servidor" });
        }
    }

    static async updateCart(req, res){
        const { cid } = req.params
        const productsArray = req.body

        try{
            if (!Array.isArray(productsArray)) {
                return res.status(400).json({ status: "error", payload: "El body debe ser un array de productos" });
            }
            const cart = await CartService.getById(cid);
            if (!cart) {
                return res.status(404).json({ status: "fail", payload: "Carrito no encontrado" });
            }
            cart.products = productsArray;

            const updatedCart =  await CartService.update(cid, cart)
            res.status(200).json({ status: "success", payload: updatedCart });
        }catch(error){
            if (error.name === "CastError") return res.status(400).json({ status: "error", payload: "ID de carrito inválido" });
            res.status(500).json({ status: "error", payload: "Error interno del servidor" });
        }
    }

    static async updateProductQuantity(req, res){
        const { cid, pid } =  req.params;
        const { quantity } = req.body;

        try{
            if(quantity < 0){
                return res.status(400).json({ status: "error", payload: "Debe enviar una cantidad numérica mayor o igual a cero" });
            }

            const cart = await CartService.getById(cid)
            if (!cart) {
                return res.status(404).json({ status: "fail", payload: "Carrito no encontrado" });
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                
                const updatedCart = await CartService.update(cid, cart);
                res.status(200).json({ status: "success", payload: updatedCart });
            } else {
                return res.status(404).json({ status: "fail", payload: "El producto no se encuentra en el carrito" });
            }
        }catch(error){
            if (error.name === "CastError") return res.status(400).json({ status: "error", payload: "ID inválido" });
            res.status(500).json({ status: "error", payload: "Error interno del servidor" });
        }
    }

    static async clearCart(req, res) {
        const { cid } = req.params;

        try {
            const cart = await CartService.getById(cid);
            if (!cart) {
                return res.status(404).json({ status: "fail", payload: "Carrito no encontrado" });
            }

            cart.products = [];

            const updatedCart = await CartService.update(cid, cart);
            res.status(200).json({ status: "success", payload: updatedCart });

        } catch (error) {
            if (error.name === "CastError") return res.status(400).json({ status: "error", payload: "ID de carrito inválido" });
            res.status(500).json({ status: "error", payload: "Error interno del servidor" });
        }
    }
}