const fetch = require('node-fetch')
const colors = require('colors')
const isRoot = require('is-root')()
const { spawn } = require('child_process')
const config = require('./config.js')
const overwirdes = require('./arguments.js')
const log = console.log

module.exports = {
  checkConfig() {
    if (!overwirdes.noConfigCheck) {
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
        },{
          check: isRoot,
          err: 'Script not running with root access'
        }
      ]
      let quite = err => {
        log(colors.red.bold(err))
        log(colors.red('use -c to ignore'))
        process.exit()
      }
      checks.map(el => el.check ? true : quite(el.err))
    } else {
      log(colors.yellow.bold('Skipping checking the config.js file'))
    }
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
        if (wrongDomains.length) {
          log('Wrong domains found:', colors.red(...wrongDomains))
        } else {
          log(colors.green.bold('No domains found with SSL issues'))
        }
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
    if (!overwirdes.noFix) {
      let webServerCTL = 
        config.webServer == 'nginx'
          ? 'nginx'
          : 'httpd'
      let command = []
      command.push(`systemctl stop ${webServerCTL}`)
      
      let looper = i => {
        let item = list[i]
        if (item && ((overwirdes.onlyFirst && i == 0) || !overwirdes.onlyFirst)) {
          log('creating SSL certivicate for:', colors.bold(item))
          command.push(config.fixCommand.replace(/\%\%domain\%\%/g, item))
          looper(i+1)
        } else {
          command.push(`systemctl start ${webServerCTL}`)
          if (command.length == 0 || command.length == 2) {
            log(colors.green.bold('dune'))
            callback()
          } else {
            let toEx = command.join(' && ')
            module.exports.multicommand(toEx,() => {
              log(colors.green.bold('dune'))
              callback()
            })
          }
        }
      }
      looper(0)
    } else {
      log(colors.yellow.bold('Skipping correcting of the SSL certivicate'))
      callback()
    }
  },
  multicommand(command, cb) {
    // run a long command with "&&"
    let callback = (...items) => 
    (typeof cb == 'function') 
      ? cb(...items) 
      : false
    let CMDs = command.split('&&') // split all the commands into parts
    CMDs = CMDs
      .map(el => el.replace(/\r?\n|\r/g, '').split(' ')) // replace all line breaks
      .map(el => el.filter(el => el)) // remove all strings without content
    let currentLoopItem = 0
    let looper = i => {
      currentLoopItem = i
      let cmd = CMDs[i]
      if (cmd) {
        try {
          const cmdSpawn = spawn(cmd[0], cmd.slice(1, cmd.length))
          log(colors.green.bold(`running: ${cmd.join(' ')}`))
          cmdSpawn.stdout.on('data', data => log(data.toString()))
          cmdSpawn.stderr.on('data', data => log(data.toString()))
          let next = () =>
            currentLoopItem == i
              ? looper(i+1)
              : false
          cmdSpawn.on('close', next)
          cmdSpawn.on('error', next)
          cmdSpawn.on('exit', next)
        } catch (err) {
          if (currentLoopItem == i) {
            looper(i+1)
          }
        }
      } else {
        callback()
      }
    }
    looper(0)
  }
}