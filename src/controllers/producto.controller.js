import { ProductoModel } from '../models/product.model.js'
import { ProductoDao } from '../dao/product.dao.js'

const ProductoService = new ProductoDao(ProductoModel);

export class ProductoController{
    static async getAll(req, res){
        try{
            const response = await ProductoService.getAll()
            res.status(200).json({status: "success", payload: response})

        }catch(error){
            res.status(500).json({ status: "error", payload: "Error interno del servidor" });
        }
    }

    static async getById(req, res){
        const { id } = req.params
        try{
            const response = await ProductoService.getById(id)

            if (!response ){
                return res.status(404).json({status: "fail", payload: "product id not found"})
            }
            res.status(200).json({status: "success", payload: response})
        }catch(error){
            if(error.name === "CastError"){
                return res.status(400).json({ status: "error", payload: "Formato no ID invalido"})
            }

            res.status(500).json({ status: "error", payload: "Error interno del servidor" })
        }
    }
}