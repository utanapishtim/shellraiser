const test = require('brittle')
const sh = require('../')

test('it should spawn a process', async (t) => {
  const shell = sh('ls', __dirname, { stdio: ['inherit', 'pipe', 'inherit'] })
  const str = await concat(shell.process.stdout)
  const names = str.split('\n').filter(Boolean)
  t.ok((['all.js']).every((name, i) => names[i] === name))
})

async function concat (xs) {
  let str = ''
  for await (const x of xs) str += x.toString()
  return str
}
