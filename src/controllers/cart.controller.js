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
        const { id } = req.params
        try{
            const response = await CartService.getPopulatedById(id)
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
}