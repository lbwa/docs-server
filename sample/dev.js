const DocsServer = require('../dist/index')

module.exports = new DocsServer({
  headers: {
    'Access-Control-Allow-Origin': 'https://set.sh'
  },
  threshold: 1,
  filter: (origin) => {
    const removeExtension = origin.replace(/\.md$/, '')
    return `writings/${removeExtension}`
  },
  extra: [
    {
      route: '/test',
      middleware: async (ctx, next) => {
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
  ],
  headerMiddleware: async function (ctx, next) {
    const isWhitelist = ctx.origin === 'https://set.sh'
      || ctx.origin === 'http://localhost:8800'
      || ctx.origin === 'http://127.0.0.1:8800' // for test section

    if (isWhitelist) {
      ctx.set({
        'Access-Control-Allow-Origin': `${ctx.origin}`
      })
    }

    await next()
  }
})
