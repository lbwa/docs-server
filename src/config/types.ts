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

export interface initialContent {
  contentData: string
  origin: string
}

export interface contentList {
  [path: string]: contentItem
}

export interface targetPath {
  cwd: string
  dest: string
}

export  interface appOptions {
  cwd?: string
  dest?: string
  port?: number | string
  directory?: string
  extra?: extraRoutes
}

export interface server {
  customHeaders?: resHeaders
  threshold?: number
  contentList?: contentList
}

export interface extraRoutes {
  route?: string
  middleware?: Function
}
