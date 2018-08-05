import Router = require('koa-router')
import { contentList, extraRoute } from '../config/types'

const logger = require('../utils/logger')
const home = require('../controllers/home')
const docs = require('../controllers/docs')
const createErrorHandle = require('../controllers/error')
const createExtraRoutes = require('./extra')
const createMenuRoute = require('./menu')

const router = new Router()

/**
 * create all routes based on configuration
 *
 * @param {contentList} contentList content storage
 * @param {extraRoute[]} extra extra static resources routes
 * @returns a koa router instance
 */
function createRoutes (
  contentList: contentList,
  extra: extraRoute[],
  dest: string
) {
  const docsRoutes = Object.keys(contentList)

  router.get('/', home)

  for (let route of docsRoutes) {
    const formatRoute = /^\//.test(route) ? route : `/${route}`
    router.get(formatRoute, docs)
    logger.info(`[Server]`, `Generate route: ${route}`)
  }

  // Make sure createMenuRoute before createExtraRoutes
  createMenuRoute(extra, dest, router)

  createExtraRoutes(extra, router)

  return router
}

/**
 * create a koa router instance
 *
 * @param {contentList} contentList content storage
 * @param {extraRoute[]} extra extra static resources routes
 * @returns a koa router instance
 */
module.exports = function createRouter (
  contentList: contentList,
  extra: extraRoute[],
  dest: string
) {
  createRoutes(contentList, extra, dest)
    .get('*', createErrorHandle(404))
    .all('*', createErrorHandle(405))

  return router
}
