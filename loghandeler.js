const colors = require('colors')
const overwirdes = require('./arguments.js')
const l = console.log

module.exports = {
  log(type, ...argv) {
    if (argv.length == 0) {
      argv.push(type)
      type = 'Null'
    }
    
    let normLog = () => {
      l(...argv)
    }

    if (!overwirdes.noLogs) {
      switch (type) {
        case 'ignore':
          normLog()
          break
        case 'err':
          if (!overwirdes.noColors) {
            l(colors.red(...argv))
          } else {
            normLog()
          }
          break
        case 'bigErr':
          if (!overwirdes.noColors) {
            l(colors.red.bold(...argv))
          } else {
            normLog()
          }
          break
        case 'success':
          if (!overwirdes.noColors) {
            l(colors.green(...argv))
          } else {
            normLog()
          }
          break
        case 'bigSuccess':
          if (!overwirdes.noColors) {
            l(colors.green.bold(...argv))
          } else {
            normLog()
          }
          break
        case 'info':
          if (!overwirdes.noColors) {
            l(colors.yellow(...argv))
          } else {
            normLog()
          }
          break
        default:
          normLog()
          break
      }
    }
  }
}