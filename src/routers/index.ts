import Router = require('koa-router')
import { contentStorage, extraRoute } from '../config/types'

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
 * @param {contentStorage} contentStorage content storage
 * @param {extraRoute[]} extra extra static resources routes
 * @returns a koa router instance
 */
function createRoutes (
  contentStorage: contentStorage,
  extra: extraRoute[],
  dest: string
) {
  const docsRoutes = Object.keys(contentStorage)

  router.get('/', home)

  for (let route of docsRoutes) {
    const formatRoute = /^\//.test(route) ? route : `/${route}`
    router.get(formatRoute, docs)
    logger.info(`[Server]`, `Generate route: ${formatRoute}`)
  }

  // Make sure createMenuRoute before createExtraRoutes
  createMenuRoute(extra, dest, router)

  createExtraRoutes(extra, router)

  return router
}

/**
 * create a koa router instance
 *
 * @param {contentStorage} contentStorage content storage
 * @param {extraRoute[]} extra extra static resources routes
 * @returns a koa router instance
 */
module.exports = function createRouter (
  contentStorage: contentStorage,
  extra: extraRoute[],
  dest: string
) {
  createRoutes(contentStorage, extra, dest)
    .get('*', createErrorHandle(404))
    .all('*', createErrorHandle(405))

  return router
}
