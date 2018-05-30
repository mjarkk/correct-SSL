const argv = require('minimist')(process.argv)

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