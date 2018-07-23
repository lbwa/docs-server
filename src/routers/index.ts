import Router = require('koa-router')
import Koa = require('koa')

const { stringify } = require('../utils/index')

const router = new Router()

router
  .get('*', async (ctx: Koa.Context, next: Function) => {
    ctx.status = 200
    ctx.body = stringify({
      errno: 0,
      message: 'hello world'
    })
    ctx.set({
      'Content-Type': 'application/json, charset=utf-8'
    })
  })

module.exports = router
