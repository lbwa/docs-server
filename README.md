# Docs-server [![npm](https://img.shields.io/npm/v/docs-server.svg)](https://www.npmjs.com/package/docs-server) [![CircleCI](https://circleci.com/gh/lbwa/docs-server.svg?style=svg)](https://circleci.com/gh/lbwa/docs-server) [![node](https://img.shields.io/node/v/docs-server.svg)](https://www.npmjs.com/package/docs-server)

> A server which is used to build a kind of microservices for docs system.

## Feature

- Perform automatic markdown searching and generate correct dynamic routes according to the root path of your project.

- Support multiple-level documentation routes.

- Support for specifying additional static resources routes.

## Installing

```bash
# yarn
yarn add docs-server

# npm
npm i docs-server
```

## Usage

- Easy running

```js
const DocsServer = require('docs-server')

// It should be running at http://localhost:8800 by default
const app = new DocsServer()
```

- ( Optional ) You can specify your custom configuration.

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

  // extra static resource routes
  extra: [
    {
      route: '/test', // eg. http://locahost:8800/test
      middleware: async (ctx, next) => {
        // do something
      }
    }
  ]
})
```

- Test your building

```powershell
# test your server
curl -v http://localhost:8800  # response from /
curl -v http://localhost:8800/doc/sample # response from /doc/sample
```

## CHANGELOG

[CHANGELOG](./CHANGELOG.md)
