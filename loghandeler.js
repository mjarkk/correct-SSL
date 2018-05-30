const colors = require('colors')
const overwirdes = require('./arguments.js')
const l = console.log
const fs = require('fs')

// clear the config file
fs.writeFileSync('log.txt', '')

module.exports = {
  log(type, ...argv) {
    let options = ['ignore','err','bigErr','success','bigSuccess','info']
    if (
      argv.length == 0 
      && !options.includes(type)
    ) {
      argv.push(type)
      type = 'Null'
    }
    
    let normLog = () => {
      l(...argv)
      addToLogs(argv.join(' '))
    }
    let addToLogs = (...data) => {
      let check = options.indexOf(data.join('').replace(/\:|\ /g, '')) == -1
      if (check) {
        fs.appendFileSync('log.txt', data.join(' ') + '\n')
      }
    }

    let colorLog = (!overwirdes.noLogs && !overwirdes.noColors)
    switch (type) {
      case 'ignore':
        normLog()
        break
      case 'err':
        if (colorLog) {
          l(colors.red(...argv))
          addToLogs('err:', argv.join(' '))
        } else {
          normLog()
        }
        break
      case 'bigErr':
        if (colorLog) {
          l(colors.red.bold(...argv))
          addToLogs('err:', argv.join(' '))
        } else {
          normLog()
        }
        break
      case 'success':
        if (colorLog) {
          l(colors.green(...argv))
          addToLogs('success:', argv.join(' '))
        } else {
          normLog()
        }
        break
      case 'bigSuccess':
        if (colorLog) {
          l(colors.green.bold(...argv))
          addToLogs('success:', argv.join(' '))
        } else {
          normLog()
        }
        break
      case 'info':
        if (colorLog) {
          l(colors.yellow(...argv))
          addToLogs('info:', argv.join(' '))
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