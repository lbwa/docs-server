import { appOptions } from './config/types'

const Server = require('./server')
const gen = require('./generator')
const join = require('path').join

function resolve (dir: string): string {
  return join(process.cwd(), dir)
}

// TODO: redesign API
class Application {
  options: appOptions
  close: Function // http.Server -> server.close

  constructor (
    {
      cwd = resolve('/'),
      catalogOutput = resolve('/menu.json'),
      port = '8800'
    }: appOptions = {}
  ) {
    this.options = {
      cwd,
      catalogOutput,
      port
    }

    this.activateGenerator(cwd, catalogOutput)
      .then(this.activateServer.bind(this))
      .catch(this.handleError)
  }

  activateGenerator (cwd: string, catalogOutput: string) {
    return gen.activate({
      cwd,
      catalogOutput
    })
  }

  // ! Notice: Make sure `this` value equal to Application instance
  activateServer () {
    const port = this.options.port
    const server = new Server()
    server.listen(port, () => {
      console.log(`\nServer is listening on http://localhost:${port}\n`)
    })

    return server
  }

  handleError (err: Error) {
    console.error(err)
  }
}

module.exports = Application
