import Koa = require('koa')
const { stringify } = require('../utils/index')

module.exports = function (status: number = 404) {
  return async (ctx: Koa.Context, next: Function) => {
    ctx.status = status
    ctx.body = stringify({
      errno: 1,
      message: '[Error]: Invalid request'
    })
    ctx.set({
      'Content-Type': 'application/json; charset=utf-8'
    })
  }
}
