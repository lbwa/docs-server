import Koa = require('koa')

declare namespace DocsServer {
  interface responseHeader {
    [key: string]: string
  }

  interface extraRoute {
    route?: string
    middleware?: (ctx: Koa.Context, next: Function) => {}
  }

  interface headerMiddleware {
    (context: Koa.Context, next: Function): Promise<any>
  }
}

declare class DocsServer {
  constructor (options: {
    cwd?: string
    dest?: string
    port?: number | string
    headers?: DocsServer.responseHeader
    threshold?: number
    extra?: DocsServer.extraRoute[]
    filter?: Function,
    headerMiddleware?: DocsServer.headerMiddleware
  })
}

export = DocsServer
