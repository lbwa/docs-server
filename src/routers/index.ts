import Router = require('koa-router')

const config = require('../config/index')
const home = require('../controllers/home')
const docs = require('../controllers/docs')
const error = require('../controllers/error')

const router = new Router()

const routes = config.routes
const docsPath = config.docsPath

router
  .get('/', home)

for (let route of routes) {
  const format = /^\//.test(route.path) ? route.path : `/${route.path}`
  router
    .get(format, route.callback)
}

router
  // only file name
  .get(`/${docsPath}/:id`, docs)
  .get('*', error)

module.exports = router
