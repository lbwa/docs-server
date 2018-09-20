import Koa = require('koa')
import compress = require('koa-compress')
import { resHeaders, server } from './config/types'

const createRouter = require('./routers/index')
const io = require('./middleware/io')
const resHeaders = require('./middleware/resHeaders')
const etag = require('./middleware/etag')

/**
 *create a server instance based on Koa
 *
 * @class Server
 * @extends {Koa}
 */
class Server extends Koa {
  private __etag: string
  // Once params is empty object, customHeaders and threshold will be set default value
  constructor ({
    customHeaders = {},
    threshold = 1,
    contentStorage = {},
    extra = [],
    dest = './menu.json',
    headerMiddleware
  }: server = {}) {
    super()
    // every building will generate a new unique Etag
    this.__etag = etag.createEtag()
    this.setIOMiddleware()
    this.setResHeaders(customHeaders, headerMiddleware)
    this.setGzip(threshold)
    this.setRouter(contentStorage, extra, dest)
  }

  setIOMiddleware () {
    this.use(io)
    // current response process end（status 304）when identification passed,
    // and remainder middleware will not be invoked
    this.use(etag.identify(this.__etag))
  }

  setResHeaders (
    customHeaders: resHeaders = {},
    headerMiddleware: server['headerMiddleware']
  ) {
    this.use(etag(this.__etag))
    this.use(resHeaders(customHeaders, headerMiddleware))
  }

  setGzip (threshold: number=1) {
    this.use(compress({
      threshold
    }))
  }

  setRouter (
    contentStorage: server['contentStorage'],
    extra: server['extra'],
    dest: server['dest']
  ) {
    const router = createRouter(contentStorage, extra, dest)
    this.use(router.routes())
    this.use(router.allowedMethods())
  }
}

module.exports = Server

// for types
export { Server }
