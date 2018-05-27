const fetch = require('node-fetch')
const colors = require('colors')
const { spawn } = require('child_process')
const config = require('./config.js')
const log = console.log

module.exports = {
  checkConfig() {
    let c = config
    let checks = [
      {
        check: 
          c.webServer == 'autocheck'
          || c.webServer == 'apache'
          || c.webServer == 'nginx',
        err: 'The "webServer" option has a wrong input, must be: autocheck, apache or nginx'
      },{
        check: c.checkDelay <= 25 && typeof c.checkDelay == 'number',
        err: '"checkDelay" can\'t than 24 Hours and must be a number'
      },{
        check: c.checkDomains.reduce((acc, el) => 
          (el.indexOf('/') === -1 && el.indexOf(' ') === -1 && el !== '') ? acc : false, true),
        err: '"checkDomains" contains one or more domain(s) that aren\'t falid, the domains can\'t contain a "/", " " or be empty'
      }
    ]
    let quite = err => {
      console.log(colors.red.bold(err))
      process.exit()
    }
    checks.map(el => el.check ? true : quite(el.err))
  },
  getWebServer(callback) {
    fetch('http://' + config.checkDomains[0], {
      redirect: 'manual'
    })
    .then(r => {
      let webServ = r.headers.get('server').toLowerCase()
      if (typeof callback == 'function') {
        callback(
          (webServ.indexOf('nginx') != -1)
            ? 'nginx'
            : 'apache'
        )
      }
    })
    .catch(err => log(err))
  },
  checkSSL(callback) {
    let wrongDomains = []
    let looper = i => {
      let domain = config.checkDomains[i]
      if (typeof domain == 'string') {
        log('checking domain:', colors.bold(domain))
        fetch('https://' + domain, {
          redirect: 'manual'
        })
        .then(res => res.text())
        .then(data => looper(i+1))
        .catch(e => {
          let err = e.toString()
          if (err.indexOf('certificate') != -1 || err.indexOf('cert') != -1) {
            wrongDomains.push(domain)
          }
          looper(i+1)
        })
      } else {
        log(colors.green.bold('dune checking domains'))
        log('Wrong domains found:', colors.red(...wrongDomains))
        callback(wrongDomains)
      }
    }
    looper(0)
  },
  renewDomain(list, cb) {
    let callback = (...items) => 
      (typeof cb == 'function') 
        ? cb(...items) 
        : log(colors.green.bold(...items))
    let looper = i => {
      let item = list[i]
      if (item) {
        log('creating SSL certivicate for:', colors.bold(item))
        looper(i+1)
      } else {
        callback('dune')
      }
    }
    looper(0)
  }
}