const argv = require('minimist')(process.argv)
const marked = require('marked')
const TR = require('marked-terminal')
const fs = require('fs')
var stripColors = require('strip-color')
const log = console.log

marked.setOptions({
  renderer: new TR({
    tab: 2
  })
})

module.exports = {

  // Do not check the config file
  // --noConfigCheck , -c
  noConfigCheck: !!argv.noConfigCheck || !!argv.noconfigcheck || !!argv.c, 
  
  // Do not fix the SSL certivicate only check
  // --noFix , -f
  noFix: !!argv.noFix || !!argv.nofix || !!argv.f,

  // Only fix the first SSL certivicate
  // --onlyFirst , -o
  onlyFirst: !!argv.onlyFirst || !!argv.onlyfirst || !!argv.o,

  // No terminal logs
  // --noLogs , -l
  noLogs: !!argv.noLogs || !!argv.nologs || !!argv.l,

  // No colors
  // --noColors , -u
  noColors: !!argv.noColors || !!argv.nocolors || !!argv.u
}

if (argv.help) {
  let output = marked(fs.readFileSync('README.md').toString())
  if (module.exports.noColors) {
    output = stripColors(output)
  }
  log(output)
  process.exit()
}