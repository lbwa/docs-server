import Koa = require('koa')
import compress = require('koa-compress')
import { resHeaders, server } from './config/types'

const router = require('./routers/index')
const { stringify } = require('./utils/index')

async function ioMiddleware (ctx: Koa.Context, next: Function) {
  try {
    console.log('Request path :', ctx.path)
    const START = process.hrtime()
    await next ()
    const PERIOD = process.hrtime(START)
    const output = PERIOD[0] * 1e3 + PERIOD[1] * 1e-6
    const format = output.toLocaleString('zh', {
      maximumFractionDigits: 4,
      useGrouping: false
    })
    ctx.set({
      'X-Response-Time': `${format}ms`
    })
  } catch (err) {
    console.error(err)
    ctx.body = stringify({
      errno: 1,
      message: `[Internal error]: ${err.message}`
    })
    ctx.set({
      'content-type': 'application/json, charset=utf-8'
    })
  }
}

function setResHeaders (customHeader: resHeaders) {
  const baseHeader = {
    // TODO: add filter for origin whitelist
    'Access-Control-Allow-Origin': `*`,
    'vary': 'origin'
  }

  const newHeader = Object.assign(baseHeader, customHeader)

  return async function (ctx: Koa.Context, next: Function) {
    ctx.set(newHeader)
    await next()
  }
}

class Server extends Koa {
  // Once params is empty object, customHeaders and threshold will be set default value
  constructor ({ customHeaders={}, threshold=1 }: server = {}) {
    super()
    this.setIOMiddleware()
    this.setResHeaders(customHeaders)
    this.setGzip(threshold)
    this.setRouter()
  }

  setIOMiddleware () {
    this.use(ioMiddleware)
  }

  setResHeaders (customHeaders: resHeaders = {}) {
    this.use(setResHeaders(customHeaders))
  }

  setGzip (threshold: number=1) {
    this.use(compress({
      threshold
    }))
  }

  setRouter () {
    this.use(router.routes())
    this.use(router.allowedMethods())
  }
}

module.exports = Server
