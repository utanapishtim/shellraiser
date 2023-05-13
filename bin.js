const minimist = require('minimist')
const shhh = require('./')

const { _: [cmd, ...args], ...opts } = minimist(process.argv.slice(2))

const sh = shhh(cmd, args, { ...opts, stdio: 'inherit' })

process.on('exit', () => sh.close())
