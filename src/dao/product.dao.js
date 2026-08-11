

export class ProductoDao{
    constructor(model){
        this.model = model;
    }

    async getAll(){
        return await this.model.find()
    }

    async getById(id){
        return await this.model.findById(id)
    }
}