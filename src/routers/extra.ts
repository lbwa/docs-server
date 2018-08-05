import { extraRoute } from '../config/types'
import Router = require('koa-router')

const logger = require('../utils/logger')

/**
 * create extra routes based on users configuration
 *
 * @param {extraRoute[]} extra extra static resources routes
 * @returns Koa router instance
 */
module.exports = function createExtraRoutes (
  extra: extraRoute[],
  router: Router
) {
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
