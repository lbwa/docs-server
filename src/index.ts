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
  genPromise: Promise<Gen>
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
    // this.server is a http.Server instance,
    // this.gen is a Promise{<pending>},
    // this.gen is invalid on this position
  }

  async activate () {
    const options = this.options

    // To expose this.server when Application instantiation
    // To build server as soon as possible
    // Make sure this.activateServer() is before this.activateGenerator()
    // Router's docs controller always sync with gen.contentList
    this.server = this.activateServer()

    /**
     * 1. this.activeGenerator will be invoked immediately
     * 2. this.gen must be pending status promise when instantiation completed
     */
    this.genPromise = this.activateGenerator(options.cwd, options.catalogOutput)

    /**
     * 1. async function will be restore execution (enter microtask queue)
     * until Application complete instantiation which means current event loop
     * completed.
     * 2. this.gen is invalid until Application complete this own initialization
     */
    this.gen = await this.genPromise
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
}

module.exports = Application
