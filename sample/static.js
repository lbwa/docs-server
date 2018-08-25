const static = require('../dist/generator/static')
const resolve = require('path').resolve

static.run(resolve(process.cwd(), './'))
