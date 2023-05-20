const test = require('brittle')
const sh = require('../')

test('it should spawn a process', async (t) => {
  const shell = sh('ls', __dirname, { stdio: ['inherit', 'pipe', 'inherit'] })
  const str = await concat(shell.process.stdout)
  const names = str.split('\n').filter(Boolean)
  t.ok((['all.js']).every((name, i) => names[i] === name))
})

test('it should do nothing if reclosed', async (t) => {
  const shell = sh('ls', __dirname)
  shell.reject(new Error('error'))
  try { await shell } catch (e) { t.is(e.message, 'error') }
  t.ok(await shell.close() || true)

  await sh('ls', __dirname)
  t.ok(await shell.close() || true)
})

test('it can resolve with an arbitrary value', async (t) => {
  const shell = sh('ls', __dirname)
  shell.resolve(1)
  const result = await shell
  t.is(result, 1)
})

test('it can reject with an arbitrary error', async (t) => {
  const shell = sh('ls', __dirname)
  shell.reject(new Error('error'))
  try { await shell } catch (e) { t.is(e.message, 'error') }
})

async function concat (xs) {
  let str = ''
  for await (const x of xs) str += x.toString()
  return str
}
