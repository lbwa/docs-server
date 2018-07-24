# Docs-server [![npm](https://img.shields.io/npm/v/docs-server.svg)](https://www.npmjs.com/package/docs-server)

> A server which is used to build a kind of microservices for docs system.

## Feature

- Perform markdown searching and generate correct dynamic routes according to root path.

- Support for specifying additional static routes.

## Notice

Only support second-level directory temporarily.

Your project structure should be like this:

```markdown
├── doc [custom directory name]
|    ├── a.md
|    ├── b.md
|    ├── c.md
|    └── d.md
|
├── docs-server.config.js [define your custom config]
|
├── something.json [additional static route]
|
...
└── package.json
```

## Usage

1. You should specify your documents directory.

```js
// docs-server.config.js
const send = require('koa-send')
const resolve = require('path').resolve

module.exports = {
  // documents directory (required)
  // based on root path
  docsPath: 'doc',

  // extra static file route (optional)
  routes: [
    {
      path: 'menu',
      callback: async (ctx, next) => {
        await send(ctx, './menu.json', {
          root: resolve(__dirname, './')
        })
      }
    },
    {
      path: 'something',
      callback: async (ctx, next) => {
        await send(ctx, './something.json', {
          root: resolve(__dirname, './')
        })
      }
    }
  ]
}
```

2. Import module and run it

```js
const DocsServer = require('docs-server')

// It should be running at http://localhost:8800 by default
const app = new DocsServer()
```

3. ( Optional ) You can specify output path of catalog file ( menu.json ) and server port.

```js
const app = new DocsServer({
  catalogOutput: path.resolve(__dirname, './')
  port: '3000'
})
```
