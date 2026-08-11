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

    static async create(req, res){
        try {
            const { code, title, category, price, stock, description, developer, releaseYear, thumbnails } = req.body;

            if (!code || !title || price === undefined) {
                return res.status(400).json({ 
                    status: "error", 
                    payload: "Faltan campos obligatorios. Se requiere 'code', 'title' y 'price'." 
                });
            }

            if (typeof price !== 'number' || price < 0) {
                return res.status(400).json({ status: "error", payload: "El precio debe ser un número mayor o igual a 0." });
            }
            if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
                return res.status(400).json({ status: "error", payload: "El stock debe ser un número mayor o igual a 0." });
            }

            const newProduct = await ProductoService.create(req.body);

            res.status(201).json({ status: "success", payload: newProduct });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ 
                    status: "error", 
                    payload: `El código de producto '${error.keyValue.code}' ya existe. Debe ser único.` 
                });
            }

            if (error.name === 'ValidationError') {
                return res.status(400).json({ 
                    status: "error", 
                    payload: "Error de formato en los datos enviados.",
                    details: error.message 
                });
            }
            res.status(500).json({ status: "error", payload: "Error interno del servidor al crear el producto" });
        }
    }

    static async delete(req, res){
        const { id } = req.params;
        try{
            const deletedProduct = await ProductoService.delete(id);
            if (!deletedProduct) {
                return res.status(404).json({ 
                    status: "fail", 
                    payload: "No se encontró el producto a eliminar" 
                });
            }
            res.status(200).json({ 
                status: "success", 
                payload: "Producto eliminado correctamente",
                deleted: deletedProduct
            });
        }catch(error){
            if(error.name === 'CastError'){
                return res.status(400).json({
                    status: "error", 
                    payload: "Formato de ID inválido"  
                })
            }
            console.log(error)
            res.status(500).json({ 
                status: "error", 
                payload: "Error interno del servidor al eliminar el producto" 
            });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        
        try {
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ 
                    status: "error", 
                    payload: "No se enviaron datos para actualizar" 
                });
            }

            if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price < 0)) {
                return res.status(400).json({ status: "error", payload: "El precio debe ser un número mayor o igual a 0." });
            }
            if (updateData.stock !== undefined && (typeof updateData.stock !== 'number' || updateData.stock < 0)) {
                return res.status(400).json({ status: "error", payload: "El stock debe ser un número mayor o igual a 0." });
            }

            const updatedProduct = await ProductoService.update(id, updateData);
            
            if (!updatedProduct) {
                return res.status(404).json({ 
                    status: "fail", 
                    payload: "No se encontró el producto a actualizar" 
                });
            }
            
            res.status(200).json({ 
                status: "success", 
                payload: updatedProduct 
            });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ 
                    status: "error", 
                    payload: "Formato de ID inválido" 
                });
            }

            if (error.code === 11000) {
                return res.status(409).json({ 
                    status: "error", 
                    payload: `El código de producto '${error.keyValue.code}' ya está en uso por otro producto.` 
                });
            }
            
            console.error("Error en ProductoController.update:", error);
            res.status(500).json({ 
                status: "error", 
                payload: "Error interno del servidor al actualizar el producto" 
            });
        }
    }
}