


const error = {'error':'producto no encontrado'}

class ContenedorDB {
    constructor(db, table) {
        this.id = 0
        this.list = []
        this.db = db
        this.table = table

        this.init()
    }

    async init(){
        const knex = require('knex')(this.db)

        await knex.from(this.table).select("*")
            .then( (items) => {
                for (const obj of items) {
                    this.list.push(obj)
                }
            })
            .catch(err => {
                console.log(err)
                throw err
            })
            .finally( () => {
                knex.destroy()
            })

    }

    async insert(obj) {
        const knex = require('knex')(this.db)

        await knex(this.table).insert(obj)
        .then( (id) => {
            console.log(`Objeto insertado en DB con id ${id}` )
            obj.id = id[0]
            this.list.push(obj)
        })
        .catch(err => {
            console.log(err)
            throw err
        })
        .finally( () => {
            knex.destroy()
        })

        return obj
        
    }

    find(id){
        const object = this.list.find((obj) => obj.id == id)

        if(!object){
            return error
        }else{
            return object
        }
    }

    async update(id, obj){
        const index = this.list.findIndex((objT) => objT.id == id)

        if(index==-1){
            return error
        }else{
            obj.id = this.list[index].id
            this.list[index] = obj

            const knex = require('knex')(this.db)
            console.log(`actualizando el id ${id}`)
            await knex.from(this.table).where('id','=',id).update(obj)
                .then( () => {
                    console.log(`Objeto actualizado exitosamente` )
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
                .finally( () => {
                    knex.destroy()
                })
    
            return obj
        }

    }

    delete(id){

        const object = this.list.find((obj) => obj.id == id)

        if(!object){
            return error
        }else{
            this.list = this.list.filter((obj) => obj.id != id)

            const knex = require('knex')(this.db)
            knex.from(this.table).where("id","=",id).del()
                .then( () => {
                    console.log("Object deleted")
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
                .finally( () => {
                    knex.destroy()
                })


            return this.list
        }

    }

}

module.exports = ContenedorDB