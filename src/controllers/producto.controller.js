import { ProductoModel } from '../models/product.model.js'
import { ProductoDao } from '../dao/product.dao.js'

const ProductoService = new ProductoDao(ProductoModel);

export class ProductoController{
    static async getAll(req, res){
        const response = await ProductoService.getAll()
        if (!response ){
            return res.json({status: "fail", payload: "empty"})
        }
        res.json({status: "success", payload: response})
    }

    static async getById(req, res){
        const { id } = req.params

        const response = await ProductoService.getById(id)
        if (!response ){
            return res.json({status: "fail", payload: "product id not found"})
        }
        res.json({status: "success", payload: response})
    }
}