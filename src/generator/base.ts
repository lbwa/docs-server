const glob = require('glob')
const path = require('path')
const fs = require('fs')

function createError () {
  console.error('[Error]: This function should be implemented by subclass')
}

export = class BaseGenerator {
  cwd: string
  constructor () {}

  /**
   * get All markdown files paths
   * @return {Promise<void>}
   */
  async parser () {
    let paths: string[]
    try {
      paths = await this.scanner()
    } catch (e) {
      console.error(e)
    }

    await this.iterator(paths)
  }

  /**
   * get All markdown content Promises wrapper
   * @return {Promise<{origin: string, content: string}>[]}
   */
  async iterator (paths: string[]) {
    createError()
  }

  /**
   * get All markdown files paths
   * @return {Promise<path[]>}
   */
  async scanner () {
    let paths: string[] = []
    try {
      paths = await this.getPaths()
    } catch (err) {
      console.error(`[Scanner error]: ${err}`)
    }

    return paths
  }

  getPaths (): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob('*/**/*.md', {
        cwd: this.cwd,
        ignore: 'node_modules/**/*',
        nodir: true
      }, (err: null | Error, paths: string[]) => {
        err ? reject(err) : resolve(paths)
      })
    })
  }

  getContent (origin: string): Promise<{origin: string, content: string}> {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.resolve(process.cwd(), `./${origin}`),
        'utf8',
        (err: Error, content: string) => {
          err ? reject(err) : resolve({
            origin,
            content
          })
        }
      )
    })
  }
}
