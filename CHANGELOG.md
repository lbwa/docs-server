<a name="1.6.2"></a>
## [1.6.2](https://github.com/lbwa/docs-server/compare/v1.6.1...v1.6.2) (2018-08-27)


### Bug Fixes

* **server-generator:** integrate server type and static type content structure ([abba52c](https://github.com/lbwa/docs-server/commit/abba52c))



<a name="1.6.1"></a>
## [1.6.1](https://github.com/lbwa/docs-server/compare/v1.6.0...v1.6.1) (2018-08-26)


### Bug Fixes

* correct 'no getFullYear function' error caused by string type date ([84268fe](https://github.com/lbwa/docs-server/commit/84268fe))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/lbwa/docs-server/compare/v1.5.0...v1.6.0) (2018-08-25)


### Bug Fixes

* **server generator:** correct all server-generator process ([ef55252](https://github.com/lbwa/docs-server/commit/ef55252))
* **server generator:** correct menu creation process ([caa4649](https://github.com/lbwa/docs-server/commit/caa4649))


### Features

* add index.d.ts ([cbbe754](https://github.com/lbwa/docs-server/commit/cbbe754))
* **generator:** extract generator core for building two creation process ([e9c4b2d](https://github.com/lbwa/docs-server/commit/e9c4b2d))
* **static-generator:** static-generator prototype ([7ee3cc9](https://github.com/lbwa/docs-server/commit/7ee3cc9))
* support static / server mode completely ([976058f](https://github.com/lbwa/docs-server/commit/976058f))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/lbwa/docs-server/compare/v1.4.1...v1.5.0) (2018-08-16)


### Bug Fixes

* **Etag:** correct Etag to string type rather than number type ([5d3a027](https://github.com/lbwa/docs-server/commit/5d3a027))


### Features

* **Server:** add Etag module ([17e69d2](https://github.com/lbwa/docs-server/commit/17e69d2))



<a name="1.4.1"></a>
## [1.4.1](https://github.com/lbwa/docs-server/compare/v1.4.0...v1.4.1) (2018-08-15)


### Bug Fixes

* adjust max-age of menu route ([d0b7529](https://github.com/lbwa/docs-server/commit/d0b7529))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/lbwa/docs-server/compare/v1.3.1...v1.4.0) (2018-08-07)


### Features

* **server:** headerMiddleware option that will be used to replace default header setting middleware ([76e62a6](https://github.com/lbwa/docs-server/commit/76e62a6))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/lbwa/docs-server/compare/v1.3.0...v1.3.1) (2018-08-07)


### Bug Fixes

* correct package main field ([fce7b7e](https://github.com/lbwa/docs-server/commit/fce7b7e))
* restore dev.ts to dev.js for solving node_modules problem ([a4c9c8c](https://github.com/lbwa/docs-server/commit/a4c9c8c))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/lbwa/docs-server/compare/v1.2.0...v1.3.0) (2018-08-07)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/lbwa/docs-server/compare/v1.1.0...v1.2.0) (2018-08-07)


### Features

* **server:** support custom response header and minimum size to turn on gzip ([d9e285e](https://github.com/lbwa/docs-server/commit/d9e285e))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/lbwa/docs-server/compare/v1.0.3...v1.1.0) (2018-08-06)


### Features

* **Generator:** support for customizing all docs routes(excluding extra routes and menu.json) ([924849a](https://github.com/lbwa/docs-server/commit/924849a))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/lbwa/docs-server/compare/v1.0.2...v1.0.3) (2018-08-05)


### Bug Fixes

* Don't support `require('docs-server')()` because of `class` rather than `function A() {}` ([c284db9](https://github.com/lbwa/docs-server/commit/c284db9))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/lbwa/docs-server/compare/v1.0.1...v1.0.2) (2018-08-05)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/lbwa/docs-server/compare/v1.0.0...v1.0.1) (2018-08-05)


### Bug Fixes

* route generating info ([2503dfa](https://github.com/lbwa/docs-server/commit/2503dfa))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/lbwa/docs-server/compare/v0.3.0...v1.0.0) (2018-08-05)


### Bug Fixes

* restore menu.json route ([1c33b79](https://github.com/lbwa/docs-server/commit/1c33b79))


### Code Refactoring

* **app architecture:** adjust server process to support multiple-level directory ([7473241](https://github.com/lbwa/docs-server/commit/7473241))


### Features

* **Application:** add params for `require('docs-server')()` syntax ([0980491](https://github.com/lbwa/docs-server/commit/0980491))
* **Application:** expose application.genPromise for listening Promise<Gen> ([bab1b64](https://github.com/lbwa/docs-server/commit/bab1b64))
* **Application:** support `const app = require('docs-server')()` ([42bd08c](https://github.com/lbwa/docs-server/commit/42bd08c))
* support specified extra routes by instantiation ([d890352](https://github.com/lbwa/docs-server/commit/d890352))


### BREAKING CHANGES

* no longer support docs-server.config.js to specified extra routes, and replaced by
extra options
* **app architecture:** support multiple-level directory, rename catalogOutput, remove docsPath



<a name="0.3.0"></a>
# [0.3.0](https://github.com/lbwa/docs-server/compare/v0.2.0...v0.3.0) (2018-07-25)


### Features

* **Application:** expose application.server and application.gen ([08a0c45](https://github.com/lbwa/docs-server/commit/08a0c45))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/lbwa/docs-server/compare/v0.1.2...v0.2.0) (2018-07-24)


### Features

* **generator:** remove file extension from file routes ([1d541d8](https://github.com/lbwa/docs-server/commit/1d541d8))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/lbwa/docs-server/compare/v0.1.1...v0.1.2) (2018-07-24)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/lbwa/docs-server/compare/v0.1.0...v0.1.1) (2018-07-24)


### Bug Fixes

* **generator:** correct target file path by fs.readFile in generator module ([54d2aa1](https://github.com/lbwa/docs-server/commit/54d2aa1))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/lbwa/docs-server/compare/5c7be78...v0.1.0) (2018-07-24)


### Features

* **app:** basic server functionality ([5c7be78](https://github.com/lbwa/docs-server/commit/5c7be78))
* **generator:** base generator structure ([667326b](https://github.com/lbwa/docs-server/commit/667326b))
* build server base route ([724720b](https://github.com/lbwa/docs-server/commit/724720b))
* support for specifying addtional static routes ([dbe252c](https://github.com/lbwa/docs-server/commit/dbe252c))



