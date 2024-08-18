const express = require('express')
const app = express()
const hbsEngine = require('./utils/hbsEngineConfig.js')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const hbs = require('hbs')
const articleRoutes = require('./routes/articleRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const chatRoutes = require('./routes/chatRoutes.js')
const cookieParser = require('cookie-parser')
const authCheckMiddleware = require('./utils/authCheckMiddleware.js')
const multer = require('multer')
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)

dotenv.config()
const staticFilePath = path.join(__dirname, 'public')
const viewsFilePath = path.join(__dirname,'views')

app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.static(staticFilePath))
app.use(multer({dest: staticFilePath + '/media/img'}).single('image'))

io.on('connection', (socket) => {
    console.log('connect')
    socket.on('messageIsSended', async () => {
        socket.broadcast.emit('updatePage', '.chat-content')
    })
    socket.on('disconnect', () => {
        console.log('disconnect')
    })

})
app.set('view engine', 'hbs')
app.set('views', viewsFilePath)
app.engine('hbs', hbsEngine)




async function main(){
    try{
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`)
        server.listen(process.env.PORT, () => console.log('server start!'))
        
    }
    catch(err){
        console.log(err)
    }
}
main()

app.use((request, response, next) => {
    response.clearCookie('errors')
    response.locals['errors'] = request.cookies['errors'] ? request.cookies['errors'] : []
    next()
})
app.use('/', authCheckMiddleware, articleRoutes)
app.use('/user', authCheckMiddleware, userRoutes)
app.use('/messages', authCheckMiddleware, chatRoutes)
app.get('/penis', (request, response) => response.render('fdfd.hbs'))



process.on('SIGINT', async () => {
    console.log('server close!')
    await mongoose.disconnect()
    process.exit()
})