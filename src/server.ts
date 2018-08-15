import Koa = require('koa')
import compress = require('koa-compress')
import { resHeaders, server } from './config/types'

const createRouter = require('./routers/index')
const ioMiddleware = require('./middleware/io')
const resHeaders = require('./middleware/resHeaders')

/**
 *create a server instance based on Koa
 *
 * @class Server
 * @extends {Koa}
 */
class Server extends Koa {
  // Once params is empty object, customHeaders and threshold will be set default value
  constructor ({
    customHeaders={},
    threshold=1,
    contentList = {},
    extra = [],
    dest = './menu.json',
    headerMiddleware
  }: server = {}) {
    super()
    this.setIOMiddleware()
    this.setResHeaders(customHeaders, headerMiddleware)
    this.setGzip(threshold)
    this.setRouter(contentList, extra, dest)
  }

  setIOMiddleware () {
    this.use(ioMiddleware)
  }

  setResHeaders (
    customHeaders: resHeaders = {},
    headerMiddleware: server['headerMiddleware']
  ) {
    this.use(resHeaders(customHeaders, headerMiddleware))
  }

  setGzip (threshold: number=1) {
    this.use(compress({
      threshold
    }))
  }

  setRouter (
    contentList: server['contentList'],
    extra: server['extra'],
    dest: server['dest']
  ) {
    const router = createRouter(contentList, extra, dest)
    this.use(router.routes())
    this.use(router.allowedMethods())
  }
}

module.exports = Server
