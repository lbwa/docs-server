import { appOptions } from './config/types'
import Gen from './generator'
import http = require('http')

const Server = require('./server')
const gen = require('./generator')
const join = require('path').join

function resolve (dir: string): string {
  return join(process.cwd(), dir)
}

class Application {
  options: appOptions
  server: http.Server // http.Server -> server.close
  gen: Gen

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
    this.activate()
    // this.server has a value, this.gen is undefined on this position
  }

  async activate () {
    const options = this.options

    // To expose this.server when Application instantiation
    // Make sure this.activateServer() before this.activateGenerator()
    // Router's docs controller sync with gen.contentList
    this.server = this.activateServer()

    /**
     * 1. this.activeGenerator will be invoked immediately
     * 2. async function will be restore execution (enter microtask queue)
     * until Application complete instantiation which means current event loop
     * completed.
     * 3. this.gen is valid until microtask complete
     */
    this.gen = await this.activateGenerator(options.cwd, options.catalogOutput)
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
    return server.listen(port, () => {
      console.log(`\nServer is listening on http://localhost:${port}\n`)
    })
  }

  handleError (err: Error) {
    console.error(err)
  }
}

module.exports = Application
