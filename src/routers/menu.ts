import { extraRoute } from '../config/types'
import Router = require('koa-router')
import send = require('koa-send')
import Koa = require('koa')

const path = require('path')

/**
 * create menu.json route based on root path
 *
 * @param {extraRoute[]} extra extra static resources path
 * @param {string} dest output absolute path
 * @param {Router} router Koa route instance
 * @returns
 */
module.exports = function createMenuRoute (
  extra: extraRoute[],
  dest: string,
  router: Router
) {
  const relative = path.relative(process.cwd(), dest)
  const removeExt = relative.replace(/\.json$/i, '')
  const formatRelative = removeExt.replace(/\\/g, '/')

  extra.push({
    route: `/${formatRelative}`,
    middleware: async (ctx: Koa.Context, next: Function) => {
      await send(ctx, `./${relative}`, {
        // default cache time: 0.5 hour
        maxage: 30 * 60 * 1000,

        // 调整为基于根路径的目标文件路径
        root: path.resolve(process.cwd(), './')
      })
    }
  })
  return router
}
