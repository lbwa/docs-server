import { appOptions, extraRoute } from './config/types'
import Gen from './generator'
import http = require('http')

const Server = require('./server')
const gen = require('./generator')
const join = require('path').join

/**
 *
 * @param {string} dir path
 * @returns {string} path based on current working directory of nodejs process
 */
function resolve (dir: string): string {
  return join(process.cwd(), dir)
}

/**
 * @class Application
 * @param {String} cwd project root path(current working directory)
 * @param {String} dest the output path of menu.json
 * @param {String} port server port
 * @param {extraRoute[]} extra extra static resources routes
 */
class Application {
  options: appOptions
  server: http.Server // http.Server -> to expose `server.close` function
  genPromise: Promise<Gen>
  gen: Gen

  constructor (
    {
      cwd = '/',
      dest = '/menu.json',
      port = '8800',
      extra = []
    }: appOptions = {}
  ) {
    if (!(this instanceof Application)) {
      return new Application({
        cwd: resolve(cwd),
        dest: resolve(dest),
        port,
        extra
      })
    }

    this.options = {
      cwd: resolve(cwd),
      dest: resolve(dest),
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

  /**
   *activate generator
   *
   * @param {string} cwd project root path(current working directory)
   * @param {string} dest the output path of menu.json
   * @returns {Gen} Generator instance
   * @memberof Application
   */
  activateGenerator (cwd: string, dest: string) {
    return gen.activate({
      cwd,
      dest
    })
  }

  // ! Notice: Make sure `this` value equal to Application instance
  /**
   *build local server
   *
   * @param {Gen['contentList']} contentList content storage
   * @param {extraRoute[]} extra extra static resources routes
   * @returns {http.Server} http.Server instance
   * @memberof Application
   */
  activateServer (contentList: Gen['contentList'], extra: extraRoute[]):http.Server {
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
