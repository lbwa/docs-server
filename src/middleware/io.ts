import Koa = require('koa')
const { stringify } = require('../utils/index')

const testMode = process.env.NODE_ENV === 'test'


module.exports = async function io (ctx: Koa.Context, next: Function) {
  try {
    if (!testMode) console.log('Request path :', ctx.path)
    const START = process.hrtime()
    await next ()
    const PERIOD = process.hrtime(START)
    const output = PERIOD[0] * 1e3 + PERIOD[1] * 1e-6
    const format = output.toLocaleString('zh', {
      maximumFractionDigits: 4,
      useGrouping: false
    })
    ctx.set({
      'X-Response-Time': `${format}ms`
    })
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = stringify({
      errno: 1,
      message: `[Internal error]: ${err.message}`
    })
    ctx.set({
      'content-type': 'application/json; charset=utf-8'
    })
  }
}
