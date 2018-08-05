import Router = require('koa-router')
import { contentList, extraRoute } from '../config/types'

const logger = require('../utils/logger')
const home = require('../controllers/home')
const docs = require('../controllers/docs')
const createErrorHandle = require('../controllers/error')

const router = new Router()

/**
 *create all routes based on configuration
 *
 * @param {contentList} contentList content storage
 * @param {extraRoute[]} extra extra static resources routes
 * @returns a koa router instance
 */
function createRoutes (contentList: contentList, extra: extraRoute[]) {
  const docsRoutes = Object.keys(contentList)

  router.get('/', home)

  for (let route of docsRoutes) {
    // doc/sample --> /doc/sample
    const formatRoute = /^\//.test(route) ? route : `/${route}`
    router.get(formatRoute, docs)
    logger.info(`[Server]`, `Generate route: ${route}`)
  }

  // static resource route defined by users
  for (let extraRoute of extra) {
    const format = /^\//.test(extraRoute.route)
       ? extraRoute.route
       : `/${extraRoute.route}`
    router
      .get(format, extraRoute.middleware)

    logger.info(`[Server]`, `Generate route: ${extraRoute.route}`)
  }
  return router
}

/**
 *create a koa router instance
 *
 * @param {contentList} contentList content storage
 * @param {extraRoute[]} extra extra static resources routes
 * @returns a koa router instance
 */
module.exports = function createRouter (
  contentList: contentList,
  extra: extraRoute[]
) {
  createRoutes(contentList, extra)
    .get('*', createErrorHandle(404))
    .all('*', createErrorHandle(405))

  return router
}
