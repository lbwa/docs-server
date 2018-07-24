import Router = require('koa-router')

const config = require('../config/index')
const docs = require('../controllers/docs')
const error = require('../controllers/error')

const router = new Router()

const routes = config.routes
const docsPath = config.docsPath

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
