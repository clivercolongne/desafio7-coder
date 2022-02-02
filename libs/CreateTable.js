const { options } = require('./options')
const knex = require('knex')(options)

setTimeout(function () {
knex.schema.createTable('productos', table => {
    table.increments('id')
    table.string('title')
    table.float('price')
    table.string('thumbnail')
})
    .then( () => console.log("Table created"))
    .catch(err => {
        console.log(err)
        throw err
    })
    .finally( () => {
        knex.destroy()
    })
}, 2000)

//Populate table
const productos = [
    {
        "title":"El senor de los anillos",
        "price":120,
        "thumbnail":"https://planetadelibroscom.cdnstatics2.com/usuaris/libros/fotos/210/m_libros/portada_el-senor-de-los-anillos_j-r-r-tolkien_201601252224.jpg"
    },{
        "title":"Harry Potter y la Piedra Filosofal",
        "price":220,
        "thumbnail":"https://planetadelibroscom.cdnstatics2.com/usuaris/libros/fotos/48/m_libros/47740_1_lostesorosdeharrypotter.jpg"
        
    },{
        "title":"El patron Bitcoin",
        "price":300,
        "thumbnail":"https://planetadelibroscom.cdnstatics2.com/usuaris/libros/fotos/344/m_libros/portada_el-patron-bitcoin_saifedean-ammous_202111181133.jpg"    
    }
]

setTimeout(function () {

    knex('productos').insert(productos)
    .then( () => {
        console.log(`Objetos insertados en DB exitosamente` )
    })
    .catch(err => {
        console.log(err)
        throw err
    })
    .finally( () => {
        knex.destroy()
    })
}, 2000)