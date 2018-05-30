# Auto correct SSL certivicate via script
This script allows you to faster correct ssl certivactes on linux for a list of domains and a set command to automaticly fix it

![Preview Image](preview/preview.gif?raw=true "Preview Image")

## Install
- Insatll [Node.js](https://nodejs.org/en/)
- Change the [config.js](./config.js)
- `sudo npm i -g yarn`
- `chmod 777 check && yarn`

## Use
- `sudo ./check`

## Arguments
Full | Small | Pretty
--- | --- | ---
`--noConfigCheck` | `-c` | Do not check the config file
`--noFix` | `-f` | Do not fix the SSL certivicate
`--onlyFirst` | `-o` | Only fix the first SSL certivicate
`--noLogs` | `-l` | No terminal logs
`--noColors` | `-u` | No fancy colors