const fs = require('fs')
const express = require('express')
const Contenedor = require('./libs/ContenedorDB.js')
const { options } = require('./libs/options')
const {Router} = express
const router = Router()

const app = express()

const PORT = 8080

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const messages = [
    {author: 'clivercito master', text: 'Bienvenido al chat', datetime: '14/04/2003, 12:05:01'}
]

//Set template engine
app.set('views', './views')
app.set('view engine', 'ejs')

const libreria = new Contenedor(options,"productos")

//Devuelve todos los productos: GET /api/productos
router.get("/", (req, res) => {
    return res.json(libreria.list)
})

//Devuelve un producto segun su ID: GET /api/productos/:id
router.get("/:id", (req, res) => {
    let id = req.params.id
    return res.json(libreria.find(id))
})

//Recibe y agrega un producto y lo devuelve con su ID asignado: POST /api/productos
router.post("/", (req, res) => {
    let obj = req.body
    libreria.insert(obj)
    return res.redirect('/')
})

//Recibe y actualiza un producto segun su id: PUT /api/productos/:id
router.put("/:id", (req, res) => {
    let obj = req.body
    let id = req.params.id
    let put = res.json(libreria.update(id,obj))
    return put
})

//Elimina un producto segun su ID
router.delete("/:id", (req,res) => {
    let id = req.params.id
    let deleted = res.json(libreria.delete(id))
    return(deleted)
})

app.use('/api/productos', router)

//Main
app.get('/', (req, res) => {
    return res.render('ejs/index', libreria)
})

//Listening
const server = app.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})

//Websocket para el chat
const io = require('socket.io')(server)

io.on("connection", (socket) => {
    let currentTime = new Date().toLocaleTimeString()
    console.log(`${currentTime} New user connected`)

    socket.emit('messages', messages)

    //Para emitir los mensajes que llegan y sea broadcast
    socket.on("newMessage", data => {
        messages.push(data)
        io.sockets.emit("messages", messages)

        write()
    })

    socket.on("newProduct", data => {
        libreria.insert(data)
        io.sockets.emit("products", data)
    })

})

async function write(){
    try{
        await fs.promises.writeFile('data/chat.txt',JSON.stringify(messages))

    } catch (err) {
        console.log('no se pudo escribir el archivo ' + err)
    }
}

//Manejador de errores
app.use(function(err,req,res,next){
    console.log(err.stack)
    res.status(500).send('Ocurrio un error: '+err)
})