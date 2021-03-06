import Koa = require('koa')
const gen = require('../generator/server')
const { stringify } = require('../utils/index')

module.exports = async (ctx: Koa.Context, next: Function) => {
  // extract id params
  const path = ctx.path.replace(/^\//, '')
  const contentStorage = gen.contentStorage // sync with gen.contentStorage, same object

  if (!contentStorage[path]) {
    await next()
    return
  }

  ctx.status = 200
  ctx.body = stringify(contentStorage[path])
  ctx.set({
    'Content-Type': 'application/json; charset=utf-8'
  })
}
