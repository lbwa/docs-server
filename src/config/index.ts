// 若写为 import customConfig = require('../../docs-server.config') 将导致所有
// console 失效
const customConfig = require('../../docs-server.config')

const baseConfig = {
  PORT: '8800',
  directory: 'doc'
}

const config = Object.assign(baseConfig, customConfig)

module.exports = config
