# Docs-server [![npm](https://img.shields.io/npm/v/docs-server.svg)](https://www.npmjs.com/package/docs-server) [![CircleCI](https://circleci.com/gh/lbwa/docs-server.svg?style=svg)](https://circleci.com/gh/lbwa/docs-server) [![node](https://img.shields.io/node/v/docs-server.svg)](https://www.npmjs.com/package/docs-server)

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

```js
const DocsServer = require('docs-server')

// It should be running at http://localhost:8800 by default
const app = new DocsServer()
```

3. ( Optional ) You can specify output path of catalog file ( menu.json ) and server port.

```js
const app = new DocsServer({
  dest: path.resolve(__dirname, './')
  port: '3000'
})
```

```powershell
# test your server
curl -v http://localhost:3000  # response from /
curl -v http://localhost:3000/doc/sample # response from /doc/sample
```

- (Optional) You can specify your own static resource routes

```js
// docs-server.config.js
const send = require('koa-send')
const resolve = require('path').resolve

module.exports = {
  routes: [
    {
      path: 'menu',
      callback: async (ctx: Koa.Context, next: Function) => {
        await send(ctx, './menu.json', {
          root: resolve(__dirname, '../../')
        })
      }
    },
    // extra static file route (optional)
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

## CHANGELOG

[CHANGELOG](./CHANGELOG.md)
