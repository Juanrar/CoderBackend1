export class CartDao{
    constructor(model){
        this.model = model;
    }

    async create(cart){
        return await this.model.create(cart)
    }

    async getAll(){
        return await this.model.find()
    }

    async getById(id){
        return await this.model.findById(id)
    }

    async getPopulatedById(id) {
        return await this.model.findById(id).populate('products.product')
    }

    async update(id, updateData){
        return await this.model.findByIdAndUpdate(id, updateData, { new: true }).populate('products.product')
    }
}