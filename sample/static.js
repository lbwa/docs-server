const DocsServer = require('../dist/index')

// This configuration's output is in `doc` directory
new DocsServer({
  mode: 'static',

  // add this configuration to change output path to `writings` directory
  // rather than `doc` directory.

  // staticNormalize (origin) {
  //   const removeShortDate = origin.replace(/\/{0}(\d{6}-)+/g, '')
  //   const removeInitialYear = removeShortDate.replace(/^\d{4}/, '')
  //   const removeRepeat = removeInitialYear.replace(/^\/\S+\//, '')
  //   const removeExtension = removeRepeat.replace(/\.md$/, '')
  //   console.log('removeExtension :', removeExtension)
  //   return `writings/${removeExtension}`
  // }
})
