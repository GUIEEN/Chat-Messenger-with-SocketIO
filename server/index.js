const express = require('express'),
  socketIO = require('socket.io'),
  http = require('http'),
  path = require('path'),
  morgan = require('morgan'),
  db = require('./db'),
  Message = require('./models')

const app = express(),
  server = http.createServer(app),
  io = socketIO(server) // this makes it available to use static client library file of socket.io on the frontend // http://localhost:4000/socket.io/socket.io.js <- you can check it

const socketHandle = {
  connect: socket => {
    console.log(`socket with the id ${socket.id} connected`)
    socket.on('new message', data => {
      const { message, creator } = data
      Message.create({
        message, creator
      })
      socket.broadcast.emit('new message notification', data) // send message except who sent this message.
    })
  }
}

const handleGetMessages = (req, res) => {
  Message.find().then(messages => res.json({ messages }))
}

const PORT = 4000
const handleListening = () =>
  console.log(`✅ Server Running on port on: http://localhost:${PORT}`)
app.use(morgan('dev'))
app.get('/messages', handleGetMessages)

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, handleListening)
io.on('connection', socketHandle.connect)

Message.find({}).then(messages => console.log(messages))
