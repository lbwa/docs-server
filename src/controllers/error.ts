import Koa = require('koa')
const { stringify } = require('../utils/index')

module.exports = async (ctx: Koa.Context, next: Function) => {
  ctx.status = 200
  ctx.body = stringify({
    errno: 0,
    message: 'hello world'
  })
  ctx.set({
    'Content-Type': 'application/json, charset=utf-8'
  })
}
