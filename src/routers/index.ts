import Router = require('koa-router')

const config = require('../config/index')
const docs = require('../controllers/docs')
const error = require('../controllers/error')

const router = new Router()

router
  // only file name
  .get(`/${config.directory}/:id`, docs)
  .get('*', error)

module.exports = router
