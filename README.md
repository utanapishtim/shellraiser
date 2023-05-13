# 😈 Shellraiser

Raise shell in node, inspired by [`shellblazer`](https://github.com/butera-simone/shellblazer) but gives you access to the process itself.

 ## Install

 `npm i --save shellraiser`

 ## Usage

 ### Node

 ```js
 const sh = require('shellraiser')
 await sh('ls')
 await sh('npm', ['i -S shhh'])
 await sh('curl', ['https://github.com'], { stdio: 'inherit' })
 ```

 ### CLI

 ```sh
 shhh ls
 shhh npm i -S shhh
 ```

## API

### const sh = require('shellraiser')

The `sh` function spawns a process, it is essentially a thin wrapper around `const { spawn } = require('child_process')`

### const shell = sh(cmd, [args], [opts])

Spawn a process that executes `cmd` with `args` given `opts`. 

The arguments to `sh` are the same as [`spawn`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options).

Optionally, you can `await` completion of the process with `await sh(cmd, args, opts)`.

### shell.then([fn])

Just like `Promise`'s `.then()`.

### shell.catch([fn])

Just like `Promise`'s `.catch()`.

### shell.resolve([any])

Forcibly resolve the underlying promise with an arbitrary value, automatically cleans up the underlying process.

### shell.reject([any])

Forcibly reject the underlying promise with an arbitrary value, automatically cleans up the underlying process.

#### const { process } = sh(cmd, [args], [opts])

The underlying process object.

#### const { promise } = sh(cmd, [args], [opts])

The underlying promise.
