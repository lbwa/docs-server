import BaseGenerator = require('./base')
import path = require('path')

const Mtj = require('mark-to-json')
const formatDate = require('../utils/format-date')

type normalize = (path: string) => string

class StaticGenerator extends BaseGenerator {
  private __normalize: normalize

  constructor () {
    super()
  }

  async run ({cwd, normalize}: {cwd: string, normalize: normalize}) {
    this.cwd = cwd
    this.__normalize = normalize
    try {
      await this.parser()
    } catch (e) {
      console.error(e)
    }
  }

  async iterator (paths: string[]) {
    // read every markdown
    paths.map(async (singlePath: string) => {
      let content: string
      let origin: string

      try {
        // 防止将 {} 解析为代码块，应该解析为对象
        ({ origin, content } = await this.getContent(singlePath))
      } catch (err) {
        console.error(err)
      }

      const normalized = this.normalizeRoute(origin)

      new Mtj({
        token: content,
        dest: path.resolve(process.cwd(), `./${normalized}.json`),
        extraHeader: {
          errno: 0,
          to: normalized
        },
        contentKey: 'content',
        filter (schema: {[key: string]: any}) {
          schema.date = formatDate(schema.date)
        }
      })
    })
  }

  normalizeRoute (origin: string) {
    return this.__normalize ? this.__normalize(origin) : defaultNormalize(origin)
  }
}

export = new StaticGenerator()

function defaultNormalize (origin: string) {
  return origin.replace(/\.md$/, '')
}
