import Koa = require('koa')
const gen = require('../generator')
const { stringify } = require('../utils/index')

module.exports = async (ctx: Koa.Context, next: Function) => {
  // extract id params
  const path = ctx.path.replace(/^\//, '')
  const contentList = gen.contentList // sync with gen.contentList, same object

  if (!contentList[path]) {
    await next()
    return
  }

  ctx.status = 200
  ctx.body = stringify(contentList[path])
  ctx.set({
    'Content-Type': 'application/json; charset=utf-8'
  })
}
