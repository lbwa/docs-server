import Koa = require('koa')

export interface resHeaders {
  [key: string]: string
}

export interface meta {
  title: string
  author: string
  date: Date
  tags: string[]
}

export interface post extends meta {
  errno: number
  to: string
}

interface contentItem extends post {
  data: string
}

export interface contentWrapper {
  content: string
  origin: string
}

export interface contentStorage {
  [path: string]: contentItem
}

export interface targetPath {
  cwd: string
  dest: string
  filter: (origin: string) => string
}

export interface appOptions {
  cwd?: string
  dest?: string
  port?: number | string
  mode?: string
  headers?: resHeaders
  threshold?: number
  extra?: extraRoute[]
  filter?: Function,
  headerMiddleware?: headerMiddleware
  staticNormalize? : (path: string) => string
}

export interface server {
  customHeaders?: resHeaders
  threshold?: number
  contentStorage?: contentStorage
  extra?: extraRoute[]
  dest?: string
  headerMiddleware?: headerMiddleware
}

export interface extraRoute {
  route?: string
  middleware?: (ctx: Koa.Context, next: Function) => {}
}

export interface headerMiddleware {
  (context: Koa.Context, next: Function): Promise<any>
}
