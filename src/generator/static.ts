import BaseGenerator = require('./base')
import path = require('path')

const Mtj = require('mark-to-json')

class StaticGenerator extends BaseGenerator {
  constructor () {
    super()
  }

  async run (cwd: string) {
    this.cwd = cwd
    try {
      await this.parser()
    } catch (e) {
      console.error(e)
    }
  }

  loop (paths: string[]) {
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
        contentKey: 'content'
      })
    })
  }

  normalizeRoute (origin: string) {
    const removeShortDate = origin.replace(/\/{0}(\d{6}-)+/g, '')
    const removeInitialYear = removeShortDate.replace(/^\d{4}/, '')
    const removeRepeat = removeInitialYear.replace(/^\/\S+\//, '')
    const removeExtension = removeRepeat.replace(/\.md$/, '')
    return `writings/${removeExtension}`
  }
}

module.exports = new StaticGenerator()
