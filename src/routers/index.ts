import Router = require('koa-router')
import { contentList } from '../config/types'

const logger = require('../utils/logger')
const config = require('../config/index')
const home = require('../controllers/home')
const docs = require('../controllers/docs')
const createErrorHandle = require('../controllers/error')

const router = new Router()

const routes = config.routes

function createRoutes (contentList: contentList) {
  const docsRoutes = Object.keys(contentList)

  router.get('/', home)

  for (let route of docsRoutes) {
    // doc/sample --> /doc/sample
    const formatRoute = /^\//.test(route) ? route : `/${route}`
    router.get(formatRoute, docs)
    logger.info(`[Server]`, `Generate route: ${route}`)
  }

  // static resource route defined by users
  for (let route of routes) {
    const format = /^\//.test(route.path) ? route.path : `/${route.path}`
    router
      .get(format, route.callback)
  }
  return router
}

function createRouter (contentList: contentList) {
  createRoutes(contentList)
    .get('*', createErrorHandle(404))
    .all('*', createErrorHandle(405))

  return router
}

module.exports = createRouter
