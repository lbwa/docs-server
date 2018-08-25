# Docs-server [![npm](https://img.shields.io/npm/v/docs-server.svg)](https://www.npmjs.com/package/docs-server) [![CircleCI](https://circleci.com/gh/lbwa/docs-server.svg?style=svg)](https://circleci.com/gh/lbwa/docs-server) [![node](https://img.shields.io/node/v/docs-server.svg)](https://www.npmjs.com/package/docs-server)

> A server implementation which is used to build a docs system.

## Why

I create this project just for implementing my docs back-end simply. It's unusual back-end module which is used to build disposable micro-server.

I use this project in some platform where user has no write permission on runtime mode, so this project don't support for adding new docs when server is running. This is intentional. You can use this project to your own documentation module If you have same situation.

## Features

- Perform automatic markdown searching and generate correct dynamic routes according to the root path of your project.

- Support multiple-level documentation routes.

- Support for specifying additional static resources routes.

- Support for customizing all docs routes

- Support for customizing docs response headers

- Support for specifying minimum response size in bytes to turn on gzip

- Support `static` mode, You can only generator `JSON` static files without server building.

## Installing

```bash
# yarn
yarn add docs-server

# npm
npm i docs-server
```

## Usage

- Building server from easy way

```js
const DocsServer = require('docs-server')

// It should be running at http://localhost:8800 by default
const app = new DocsServer()
```

### Server mode

- You can specify your custom configuration.

```js
const resolve = require('path').resolve
const DocsServer = require('docs-server')

// Notice: all options is optional
const app = new DocsServer({
  // should be nodejs current working directory
  // recommend you keep default value (your project root path)
  cwd: resolve(__dirname, './'),

  // the output path of catalog files (based on current working directory)
  dest: resolve(__dirname, './menu.json'),

  // your server running port
  port: '8800',

  // headersMiddleware option can override this Headers option
  headers: {
    // default value: '*'
    'Access-Control-Allow-Origin': '*',

    // default value: 'origin'
    'vary': 'origin',

    // Notice: server will set 'Content-Type' header by default

    // other response headers you want set
    'Access-Control-Allow-Methods': 'GET,POST'
  },

  // minimum response size in bytes to turn on gzip
  // default value: 1 bytes
  threshold: 1

  // extra static resource routes
  extra: [
    {
      route: '/test', // eg. http://locahost:8800/test
      middleware: async (ctx, next) => {
        // do something
      }
    }
  ],

  /**
   * docs routes filter, will not filter your extra routes and menu.json
   * @param {String} origin: origin routes, equal to your docs path based on root
   * @return {String} formative string, your expected routes syntax
   */
  // origin: 2018/123456-aa/123456-aa.md ----> formative result: /writings/aa
  filter: (origin) => {
    const removeShortDate = origin.replace(/\/{0}(\d{6}-)+/g, '')
    const removeInitialYear = removeShortDate.replace(/^\d{4}/, '')
    const removeRepeat = removeInitialYear.replace(/^\/\S+\//, '')
    const removeExtension = removeRepeat.replace(/\.md$/, '')
    return `writings/${removeExtension}`
  },
  // request /writings/aa, get origin data 2018/123456-aa/123456-aa.md

  /**
   * a middleware for setting response headers
   * This option will COVER headers option
   *
   * @param {Koa.Context} ctx
   * @param {Function} next
   */
  headerMiddleware: async function (ctx, next) {
    // do something

    // for example, You can create a whitelist for CORS origin headers
    const isInWhitelist = ctx.origin === 'https://github.com'
      || ctx.origin === 'http://example.com'

    if (isWhitelist) {
      ctx.set({
        'Access-Control-Allow-Origin': `${ctx.origin}`
      })
    }

    // DON'T forget invoke next()
    await next()
  }
})
```

- ***Notice***:

    - All options is optional

    - Default filter will just remove docs file extension name

    - Custom filter ***MUST*** return a string type value, and it will be only used to generate docs routes (excluding `extra routes` and `menu.json`)

    - Two choices to set response headers

        1. ***headers***: set a headers object that will be used to set response header

        2. ***headerMiddleware***: default middleware will be replaced by your headerMiddleware setting, and DON'T forget invoke next() in middleware function body

- Test your building

```powershell
# test your server
curl -v http://localhost:8800  # response from /
curl -v http://localhost:8800/doc/sample # response from /doc/sample
```

### Static mode

```js
const DocsServer = require('docs-server')

// JSON file path will be generated from original markdown files path
new DocsServer({
  mode: 'static',

  // Default behavior is only remove files extension
  staticNormalize (origin) {
    // do something you like
    return /* for example */ origin.replace(/\.md$/, '')
  }
})
```

In the static mode, `mode` option is ***required***, and `staticNormalize` is ***optional***. `staticNormalize` option is used to specific what you want to change based on markdown file path.

The sample file under static mode is [here]

[here]:./sample/static.js

## CHANGELOG

[CHANGELOG](./CHANGELOG.md)
