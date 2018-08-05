import { appOptions, extraRoutes } from './config/types'
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
  server: http.Server // http.Server -> to expose `server.close` function
  genPromise: Promise<Gen>
  gen: Gen

  constructor (
    {
      cwd = resolve('/'),
      dest = resolve('/menu.json'),
      port = '8800',
      extra = {}
    }: appOptions = {}
  ) {
    if (!(this instanceof Application)) {
      return new Application({
        cwd,
        dest,
        port,
        extra
      })
    }

    this.options = {
      cwd,
      dest,
      port,
      extra
    }

    this.activate()
  }

  async activate () {
    const options = this.options

    /**
     * 1. this.activeGenerator will be invoked immediately
     * 2. this.gen must be pending status promise when instantiation completed
     */
    this.genPromise = this.activateGenerator(options.cwd, options.dest)

    /**
     * 1. async function wouldn't restore execution (enter microtask queue)
     * until Application complete instantiation which means all mission
     * in the current (macro-)task queue has been completed
     * 2. this.gen is invalid until Application complete this own initialization
     */
    this.gen = await this.genPromise

    // Doesn't be invoked until generator complete mission
    this.server = this.activateServer(this.gen.contentList, this.options.extra)
  }

  activateGenerator (cwd: string, dest: string) {
    return gen.activate({
      cwd,
      dest
    })
  }

  // ! Notice: Make sure `this` value equal to Application instance
  activateServer (contentList: Gen['contentList'], extra: extraRoutes):http.Server {
    const port = this.options.port
    const server = new Server({
      contentList,
      extra
    })
    return server.listen(port, () => {
      console.log(`\nServer is listening on http://localhost:${port}\n`)
    })
  }
}

module.exports = Application
