import Koa = require('koa')
import compress = require('koa-compress')
import { resHeaders } from './config/types'

const router = require('./routers/index')
const { stringify } = require('./utils/index')

// instance
const koa = new Koa()

async function finalController (ctx: Koa.Context, next: Function) {
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

function koaWrapper (customHeaders: resHeaders = {}, threshold: number = 1) {
  // Make sure router instance to the final
  koa
    .use(finalController)
    .use(setResHeaders(customHeaders))
    .use(compress({
      threshold
    }))
    .use(router.routes())
    .use(router.allowedMethods())

  return koa
}

module.exports = koaWrapper
