import Koa = require('koa')

const DocsServer = require('../src/index')

module.exports = new DocsServer({
  customHeaders: {
    'Access-Control-Allow-Origin': 'https://set.sh'
  },
  threshold: 1,
  filter: (origin: string) => {
    const removeExtension = origin.replace(/\.md$/, '')
    return `writings/${removeExtension}`
  },
  extra: [
    {
      route: '/test',
      middleware: async (ctx: Koa.Context, next: Function) => {
        ctx.status = 200
        ctx.body = JSON.stringify({
          errno: 0,
          msg: 'test route'
        })
        ctx.set({
          'Content-Type': 'application/json; charset=utf-8'
        })
      }
    }
  ]
})
