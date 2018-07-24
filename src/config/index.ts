import Koa = require('koa')

const { resolve } = require('../utils/index')
// Don't use `import` keywords when target is js file, otherwise all console will be invalid
const customConfig = require(resolve(process.cwd(), 'docs-server.config.js'))
const send = require('koa-send')

const baseConfig = {
  // server port
  PORT: '8800',

  // documents directory
  docsPath: 'doc',

  // extra static file route
  routes: [
    {
      path: 'menu',
      callback: async (ctx: Koa.Context, next: Function) => {
        await send(ctx, './menu.json', {
          root: resolve(__dirname, '../../')
        })
      }
    }
  ]
}

const config = Object.assign(baseConfig, customConfig)

module.exports = config
