const argv = require('minimist')(process.argv)
const log = console.log

module.exports = {

  // Do not check the config file
  // --noConfigCheck , -c
  noConfigCheck: !!argv.noConfigCheck || !!argv.c, 
  
  // Do not fix the SSL certivicate only check
  // --noFix , -f
  noFix: !!argv.noFix || !!argv.f,

  // Only fix the first SSL certivicate
  // --onlyFirst , -o
  onlyFirst: !!argv.onlyFirst || !!argv.o

}