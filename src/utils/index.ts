const stringify = JSON.stringify.bind(JSON)
const resolve = require('path').resolve
const join = require('path').join

module.exports = {
  stringify,
  resolve,
  join
}

export {}
