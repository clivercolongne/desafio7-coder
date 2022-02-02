const { options } = require('./options')
const knex = require('knex')(options)

knex.schema.dropTable('productos')
    .then( () => {
        console.log(`Tabla dropeada extosamente` )

    })
    .catch(err => {
        console.log(err)
        throw err
    })
    .finally( () => {
        knex.destroy()
    })