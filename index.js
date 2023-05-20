const { spawn } = require('child_process')
const { once } = require('events')
const assert = require('nanoassert')
const ReadyResource = require('ready-resource')
const isOptions = require('is-options')
const filicide = require('tree-kill')

class Sh extends ReadyResource {
  cmd = null
  args = null
  opts = null
  promise = null
  process = null

  _resolve = null
  _reject = null
  _ac = null

  constructor (cmd, args, _opts = {}) {
    assert(cmd, 'Must provide a cmd!')
    super()

    if (typeof args === 'string') args = args.split(' ').filter(Boolean)

    if (!Array.isArray(args) && isOptions(args) && !_opts) {
      _opts = args
      args = []
    }

    const { ac, ...opts } = _opts

    this.cmd = cmd
    this.args = args
    this.opts = opts

    const p = new Promise((_resolve, _reject) => Object.assign(this, { _resolve, _reject }))

    const onresolved = (x) => {
      this.close()
      return x
    }

    const onrejected = (e) => {
      this.close()
      throw e
    }

    this.promise = p.then(onresolved, onrejected)
    this.ready()
  }

  resolve (...args) {
    return this._resolve(...args)
  }

  reject (...args) {
    return this._reject(...args)
  }

  then (...args) {
    return this.promise.then(...args)
  }

  catch (...args) {
    return this.promise.catch(...args)
  }

  async _open () {
    const l = this.args.length

    this.process = spawn(this.cmd, this.args, {
      env: process.env,
      cwd: '.',
      ...this.opts
    })

    this.process.on('error', this.reject.bind(this))
    this.process.on('exit', (code) => {
      if (code) this.reject(new Error(`${this.cmd} ${this.args.join(' ')}${l ? ' ' : ''}failed with code: ${code}`))
      else this.resolve()
    })
  }

  async _close () {
    const pid = this.process.pid
    const exited = once(this.process, 'exit')
    filicide(pid)
    return exited
  }
}

const shellraiser = (...args) => new Sh(...args)

module.exports = shellraiser
