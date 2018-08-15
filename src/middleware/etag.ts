import Koa = require('koa')
import { Server } from '../server'

module.exports = function (etag: string) {
  return async function (ctx: Koa.Context, next: Function) {
    await next()
    ctx.set({
      'Etag': etag
    })
  }
}

module.exports.createEtag = function createEtag () {
  return Math.random().toString(16).slice(2)
}

module.exports.identify = function createIdentify (__etag: Server['__etag']) {
  return async function (ctx: Koa.Context, next: Function) {
    if (ctx.request.header['if-none-match'] === __etag) {
      ctx.status = 304
      return
    }
    await next()
  }
}
