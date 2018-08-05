const send = require('koa-send')
const resolve = require('path').resolve

module.exports = {
  // extra static file route
  routes: [
    {
      path: 'menu',
      callback: async (ctx, next) => {
        await send(ctx, './menu.json', {
          root: resolve(__dirname, './')
        })
      }
    }
  ]
}
