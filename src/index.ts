const koa = require('./server')
const config = require('./config/index')
const gen = require('./generator')
const { resolve } = require('./utils/index')

gen
  .activate({
    cwd: resolve(__dirname, '../'),
    catalogOutput: resolve(__dirname, '../menu.json')
  })
  .then(() => {
    koa().listen(config.PORT, () => {
      console.log(`\nServer is listening on http://localhost:${config.PORT}\n`)
    })
  })
  .catch((err: Error) => {
    console.error(err)
  })

export {}
