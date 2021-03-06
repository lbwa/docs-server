import BaseGenerator = require('./base')
import fs = require('fs')
import { targetPath, contentWrapper, meta, post } from '../config/types'

const reader = require('gray-matter')
const formatDate = require('../utils/format-date')
const stringify = require('../utils/index').stringify

class ServerGenerator extends BaseGenerator {
  contentStorage: {
    [key: string]: any
  }
  dest: string
  filter: (origin: string) => string
  menu: post[]
  constructor () {
    super()
    this.contentStorage = {}
    this.menu = []
  }

  async run ({ cwd, dest, filter}: targetPath) {
    this.cwd = cwd
    this.dest = dest
    this.filter = filter
    try {
      await this.parser()
    } catch (e) {
      console.error(e)
    }

    return this
  }

  async iterator (paths: string[]) {
    const contentPromises = paths.map(async (path: string) => {
      let wrapper: contentWrapper
       try {
         wrapper = await this.getContent(path)
       } catch (e) {
         console.error(e)
       }

       return wrapper
    })

    for (const init of contentPromises) {
      let content: string
      let origin: string

      try {
        ({ content, origin } = await init)
      } catch (e) {
        console.error(e)
      }

      this.writeToMemory({
        origin,
        content
      })
    }

    this.createMenu(stringify(this.menu))
  }

  writeToMemory ({
    origin,
    content
  }: contentWrapper) {
    const raw: {
      content: string
      data: meta
    } = reader(content)

    // ({ title, author, date, tags } = raw.data)
    const header = raw.data
    const title = header.title
    const author = header.author
    const date = formatDate(header.date)
    const tags = header.tags

    let normalizeRoute: string = this.filter
      ? this.filter(origin)
      : origin.replace(/\.md$/g, '')

    const itemSchema = {
      errno: 0,
      to: normalizeRoute,
      title,
      author,
      date,
      tags,
    }

    this.menu.unshift(itemSchema)

    this.contentStorage[normalizeRoute] = {
      errno: 0,
      to: normalizeRoute,
      title,
      author,
      date,
      tags,
      content: raw.content
    }
  }

  createMenu (menu: string) {
    const ws = fs.createWriteStream(this.dest)
    ws.on('close', () => {
      console.log(`\n👌  generate menu successfully in ${this.dest} ! \n`)
    })
    ws.write(stringify(this.menu))
    ws.end()
  }
}

module.exports = new ServerGenerator()

export default ServerGenerator
