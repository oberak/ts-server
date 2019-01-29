function Gpio(callback) {
  // for communication module
  this.dispWeight = function (data) {
    console.log('dispay to LCD', data)
  }

  // for test
  function test() {
    callback(
      {
        type: 'RFID',
        data: '112323243',
      },
    )
  }
  setInterval(test, 40000)
}

module.exports = Gpio
