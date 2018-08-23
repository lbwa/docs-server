import { meta, post, contentWrapper, contentStorage, targetPath } from '../config/types'

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const stringify = require('./utils/index').stringify
const readMeta = require('front-matter')
const formatDate = require('./utils/format-date')

class Gen {
  // contentStorage is used to be a storage for all docs
  contentStorage: contentStorage
  cwd: string
  filter: (origin: string) => string

  constructor () {
    // injected docs data when this.activate is invoked
    this.contentStorage = {}
  }

  /**
   * activate Generator
   * extract function named `activate` for getting a Promise object
   *
   * @param {String} cwd working path
   * @param {String} dest output path
   * @param {Function} filter a filter function for filtering origin doc route
   * @returns {Promise<GenInstance>}
   * @memberof Gen
   */
  async run ({ cwd, dest, filter }: targetPath) {
    let headMeta: string

    this.cwd = cwd
    this.filter = filter

    try {
      headMeta = await this.parser()
    } catch (err) {
      console.error(err)
    }

    fs.writeFile(dest, headMeta, (err: object) => {
      err
        ? console.error(err)
        : console.log(`\n👌  generate menu successfully in ${dest} ! \n`)
    })

    return this
  }

  /**
   *activate scanner
   *
   * @param {string} path working path
   * @param {Function} filter a filter function for filtering origin doc route
   * @returns {Promise<menu>}
   * @memberof Gen
   */
  async parser () { // import a filter for basic route
    let contentPromises

    try {
      contentPromises = await this.scanner()
    } catch (err) {
      console.error(err)
    }

    // ! loop
    let menu: post[] = []
    for (const initialContent of contentPromises) {
      let content: string
      let origin: string

      try {
        // Don't miss the brackets around this expression
        ({ content, origin } = <contentWrapper>await initialContent)
      } catch (err) {
        console.error(err)
      }

      const raw = readMeta(content)

      // generate menu, save it by JSON file
      const header: meta = raw.attributes
      const title = header.title
      const author = header.author
      const date = formatDate(header.date)
      const tags = header.tags

      // * optional: filter origin string
      let normalizeRoute: string = this.filter
        ? this.filter(origin)
        : origin.replace(/\.md$/, '')

      const menuItem = {
        errno: 0,
        to: normalizeRoute,
        title,
        author,
        date,
        tags
      }

      menu.unshift(menuItem)

      // generate content list, saved by object
      const body: string = raw.body
      const to: string =  normalizeRoute

      // * single content structure
      this.contentStorage[to] = {
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

    return stringify(menu)

    // ! loop end
  }

  /**
   *scan all markdown files in project
   *
   * @param {string} cwd the beginning of working path
   * @returns {Promise<singleDocDate>[]}
   * @memberof Gen
   */
  async scanner () {
    let docsPath: string[] = []

    try {
      docsPath = await this.getPaths()
    } catch (err) {
      console.error(err)
    }

    // asynchronous loading at the same time
    const contentPromises = docsPath.map(async (doc: string) => {
      let docContent: object

      try {
        docContent = await this.getContent(doc)
      } catch (err) {
        console.error(err)
      }
      return docContent
    })

    // (Promise<singleDocData>)[]
    return contentPromises
  }

  // ! deleting start
  /**
   *generate all path
   *
   * @param {string} cwd working path
   * @returns {Promise<string[]>} a Array instance including all path
   * @memberof Gen
   */
  getPaths (): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob('*/**/*.md', {
        cwd: this.cwd,
        ignore: 'node_modules/**/*',
        nodir: true
      }, (err: null | object, docsPath: string[]) => {
        err ? reject(err) : resolve(docsPath)
      })
    })
  }

  /**
   * read specific file by async
   *
   * @param {string} target target file
   * @returns Promise<err | file data>
   * @memberof Gen
   */
  getContent (target: string) {
    // `target` just like 'do/sample/.../sample.md'
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.resolve(process.cwd(), `./${target}`),
        'utf8',
        (err: Error, content: string) => {
          err ? reject(err) : resolve({origin: target, content})
        }
      )
    })
  }
  // ! deleting end
}

const gen = new Gen()

module.exports = gen

// Only for types
export default Gen
