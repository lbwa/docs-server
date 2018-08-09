import { appOptions, extraRoute, server } from './config/types'
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
 * @param {String} cwd current working directory(should be a absolute path)
 * @param {String} dest the output path of menu.json(should be a absolute path)
 * @param {String} port server port
 * @param {Object} headers custom response headers
 * @param {Number} threshold minimum size in bytes to turn on gzip
 * @param {extraRoute[]} extra extra static resources routes
 * @param {Function} filter a filter function for filtering origin doc route
 * @param {Function} headerMiddleware a middleware for setting response header
 */
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
      headers = {},
      threshold = 1,
      extra = [],
      filter,
      headerMiddleware
    }: appOptions = {}
  ) {
    this.options = {
      cwd,
      dest,
      port,
      headers,
      threshold,
      extra,
      filter,
      headerMiddleware
    }

    this.activate()
  }

  async activate () {
    const options = this.options

    /**
     * 1. this.activeGenerator will be invoked immediately
     * 2. this.genPromise must be pending status promise when instantiation
     * completed (Change status in microtask queue)
     */
    this.genPromise = this.activateGenerator(
      options.cwd,
      options.dest,
      options.filter
    )

    /**
     * 1. async function wouldn't restore execution (means enter microtask
     * queue) until Application complete instantiation which means the current
     * (macro-)task has been completed
     * 2. this.gen is invalid until Application complete this own initialization
     */
    this.gen = await this.genPromise

    // Don't be invoked until generator complete mission
    this.server = this.activateServer(
      options.headers,
      options.threshold,
      this.gen.contentList,
      options.extra,
      options.dest,
      options.headerMiddleware
    )
  }

  /**
   *activate generator
   *
   * @param {string} cwd project root path(current working directory)
   * @param {string} dest the output path of menu.json
   * @param {Function} filter a filter function for filtering origin doc route
   * @returns {Gen} Generator instance
   * @memberof Application
   */
  activateGenerator (cwd: string, dest: string, filter: Function) {
    return gen.activate({
      cwd,
      dest,
      filter
    })
  }

  /**
   * build local server
   *
   * @param {Object} headers custom response headers
   * @param {Number} threshold minimum size in bytes to turn on gzip
   * @param {Gen['contentList']} contentList content storage
   * @param {extraRoute[]} extra extra static resources routes
   * @param {string} dest the output path of menu.json
   * @param {Function} headerMiddleware a middleware for setting response header
   * @returns {http.Server} http.Server instance
   * @memberof Application
   */
  activateServer (
    customHeaders: server['customHeaders'],
    threshold: server['threshold'],
    contentList: Gen['contentList'],
    extra: extraRoute[],
    dest: string,
    headerMiddleware: server['headerMiddleware']
  ):http.Server {
    const port = this.options.port
    const server = new Server({
      customHeaders,
      threshold,
      contentList,
      extra,
      dest,
      headerMiddleware
    })
    return server.listen(port, () => {
      console.log(`\nServer is listening on http://localhost:${port}\n`)
    })
  }
}

module.exports = Application
