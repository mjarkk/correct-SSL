const config = require('./config.js')
const funs = require('./functions.js')
const fetch = require('node-fetch')

const log = console.log

// check the config file
funs.checkConfig()

let checkSSL = () =>
  funs.checkSSL(funs.renewDomain)

// get the server types
if (config.webServer == 'autocheck') {
  funs.getWebServer(type => {
    config.webServer = type
    checkSSL()
  })
} else {
  checkSSL()
}