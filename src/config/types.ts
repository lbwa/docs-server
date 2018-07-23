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
  catalogOutput: string
}

export interface server {
  customHeaders?: resHeaders
  threshold?: number
}
