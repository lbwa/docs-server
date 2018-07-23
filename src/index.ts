const koa = require('./server')
const config = require('./config/index')

koa().listen(config.PORT, () => {
  console.log(`\nServer is listening on http://localhost:${config.PORT}\n`)
})

export {}
