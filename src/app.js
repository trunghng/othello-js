const path = require('path')
const express = require('express')
const session = require('express-session')
const config = require('./configs/app.config')

// app setup
const app = express()
const port = config.web.port
const server = app.listen(port, () => console.log(`Listening on port ${port}!`))

// body-parser
app.use(express.urlencoded({ extended : true }))
app.use(express.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

// session setup
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'keyboard cat'
}))

// routing
app.use('/', require('./routes/index.route'))
app.use('/game', require('./routes/game.route'))


// socket setup
const io = require('socket.io')(server)
const socketController = require('./socket')(io)