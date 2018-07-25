import { meta, post, initialContent, contentList, targetPath } from './config/types'

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const readMeta = require('front-matter')
const formatDate = require('./utils/format-date')

class Gen {
  // contentList is used to be a storage for all docs
  contentList: contentList

  constructor () {
    // injected docs data when this.activate is invoked
    this.contentList = {}
  }

  // extract function named `activate` for getting a Promise object
  async activate ({ cwd, catalogOutput }: targetPath) {
    let headMeta: string

    try {
      headMeta = await this.parser(cwd)
    } catch (err) {
      console.error(err)
    }

    fs.writeFile(catalogOutput, headMeta, (err: object) => {
      err
        ? console.error(err)
        : console.log(`\n👌  generate menu successfully in ${catalogOutput} ! \n`)
    })

    return this
  }

  async parser (path: string) {
    let catalog: post[] = []
    let docsPromises

    try {
      docsPromises = await this.scanner(path)
    } catch (err) {
      console.error(err)
    }

    for (const initialContent of docsPromises) {
      let contentData: string
      let origin: string

      try {
        // Don't miss the brackets around this expression
        ({ contentData, origin } = <initialContent>await initialContent)
      } catch (err) {
        console.error(err)
      }

      const raw = readMeta(contentData)

      // generate menu, save it by JSON file
      const header: meta = raw.attributes
      const title = header.title
      const author = header.author
      const date = formatDate(header.date)
      const tags = header.tags

      // * optional: filter origin string
      const removeExtension = origin.replace(/\.md$/, '')

      const catalogItem = {
        errno: 0,
        to: removeExtension,
        title,
        author,
        date,
        tags
      }

      catalog.unshift(catalogItem)

      // generate content list, saved by object
      const body: string = raw.body
      const to: string =  removeExtension

      // * single content structure
      this.contentList[to] = {
        // origin, // this is full path according to root path
        errno: 0,
        to,
        title,
        author,
        date,
        tags,
        data: body
      }
    }

    return JSON.stringify(catalog)
  }

  async scanner (cwd: string) {
    let docsPath: string[] = []

    try {
      docsPath = await this.getDocsPath(cwd)
    } catch (err) {
      console.error(err)
    }

    // asynchronous loading at the same time
    const docsPromises = docsPath.map(async (doc: string) => {
      let docContent: object

      try {
        docContent = await this.readFile(doc)
      } catch (err) {
        console.error(err)
      }
      return docContent
    })

    // (Promise<singleDocData>)[]
    return docsPromises
  }

  getDocsPath (cwd: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob('*/**/*.md', {
        cwd: cwd,
        ignore: 'node_modules/**/*',
        nodir: true
      }, (err: null | object, docsPath: string[]) => {
        err ? reject(err) : resolve(docsPath)
      })
    })
  }

  readFile (target: string) {
    // `target` just like 'do/sample/.../sample.md'
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.resolve(process.cwd(), `./${target}`),
        'utf8',
        (err: Error, contentData: string) => {
          err ? reject(err) : resolve({origin: target, contentData})
        }
      )
    })
  }
}

const gen = new Gen()

module.exports = gen

// Only for types
export default Gen
