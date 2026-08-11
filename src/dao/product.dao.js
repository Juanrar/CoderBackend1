

export class ProductoDao{
    constructor(model){
        this.model = model;
    }

    async getAll(){
        try{
            const result = await this.model.find()
            return result
        }catch{
            return null
        }
    }
}