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

  // recevie weight from ts-app
  socket.on('weight', (data) => {
    console.log('Data :', data)
  })

  // recevie control from ts-app
  socket.on('control', (data) => {
    switch (data.cmd) {
      case 'led':
        console.log('led control', data)
        // call gpio led on/off
        break
      case 'barrier':
        console.log('barrier control', data)
        // call gpio led on/off
        break
      default:
        console.error('not supported cmd', data.cmd)
    }
  })

  // send to ts-app
  setInterval(() => {
    socket.emit('dataRfid', { type: 'rfid', value: Math.round(Math.random() * 1000) + 100000000 })
  }, 60000)

  // test: receive and callback
  socket.on('data-callback', (data, callback) => {
    console.log('Data :', data)
    callback('callback data from server')

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
})

http.listen(3000, () => {
  console.info('listening on *:3000')
})
