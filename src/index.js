const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendfile('../public/index.html') // Truckscale server
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('sendData', (data) => {
    console.log('Data :', data)
  })

  socket.on('data', (msg) => {
    console.log('message', msg)
    socket.emit('data', { type: 'cmd-type', value: 1234 })
  })
})

http.listen(3000, () => {
  console.info('listening on *:3000')
})
