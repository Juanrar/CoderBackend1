

export class ProductoDao{
    constructor(model){
        this.model = model;
    }

    async getAll(queryFilter, options){
        return await this.model.paginate(queryFilter, options)
    }

    async getById(id){
        return await this.model.findById(id)
    }

    async create(producto){
        return await this.model.create(producto)
    }

    async delete(id){
        return await this.model.findByIdAndDelete(id)
    }

    async update(id, updateData){
        return await this.model.findByIdAndUpdate(id, updateData, { new: true });
    }
}