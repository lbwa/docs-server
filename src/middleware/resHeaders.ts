import Koa = require('koa')
import { resHeaders, server } from '../config/types'

const BASE_HEADERS = {
  // whitelist set by user custom config
  'Access-Control-Allow-Origin': `*`
}

function createBaseMiddleware (customHeaders: resHeaders) {

  const newHeader = Object.assign(BASE_HEADERS, customHeaders)

  return async function (ctx: Koa.Context, next: Function) {
    ctx.set(newHeader)
    await next()
  }
}

module.exports = function resHeaders (
  customHeaders: resHeaders,
  headerMiddleware: server['headerMiddleware']
) {

  return headerMiddleware
    ? headerMiddleware
    : createBaseMiddleware(customHeaders)
}
