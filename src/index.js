const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const GPIOs = require('./GPIOs')

app.get('/', (req, res) => {
  res.sendfile('../public/index.html') // Truckscale server
})

const gpio = new GPIOs((data) => {
  console.log('receive from gpio', data)
  io.emit('data', data)
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  // receive from app and callback
  socket.on('data', (data, fn) => {
    console.log('server: received: ', data)
    fn('sample data from server')
  })

  // receive from app (no callback)
  socket.on('weight', (data) => {
    gpio.dispWeight(data)
  })
})

http.listen(3000, () => {
  console.info('listening on *:3000')
})
