#!/usr/bin/env node
const shhh = require('./')

const [cmd, ...args] = process.argv.slice(2)

const sh = shhh(cmd, args, { stdio: 'inherit' })

const destroy = sh.close.bind(sh)

process.on('exit', destroy)
process.on('beforeExit', destroy)
process.on('uncaughtException', destroy)
process.on('unhandledRejection', destroy)
