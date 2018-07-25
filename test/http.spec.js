const Server = require('../dist/server')
const gen = require('../dist/generator')
const join = require('path').join
const { expect } = require('chai')
const http = require('http')

const PORT = '8800'
const parse = JSON.parse.bind(JSON)

function createRequest (url, fn, method='GET', statusCode=200) {
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: url,
    method,
  }

  // http.get is one of alias
  // https://nodejs.org/api/http.html#http_http_request_options_callback
  http
    .request(options, (res) => {
      res.setEncoding('utf8')
      res.on('data',fn)
      expect(res.statusCode).to.be.equal(statusCode)
    })
    .on('error', (err) => {
      console.error(err)
    })
    .end()
}

function resolve (dir) {
  return join(process.cwd(), dir)
}

describe('Build docs server', () => {
  let app
  let start
  before (done => {
    start = process.hrtime()
    gen
      .activate({
        cwd: resolve('/'),
        catalogOutput: resolve('/menu.json')
      })
      .then(() => {
        const server = new Server()
        app = server.listen(PORT, () => {
          console.log(`\nServer is listening on http://localhost:${PORT}\n`)
          done()
        })
      })
  })

  after(done => {
    app.close(() => {
      done()
    })
    console.log(process.hrtime(start))
  })

  it('Root', done => {
    createRequest('/', res => {
      const data = parse(res)
      expect(data.errno).to.be.equal(0)
      expect(data).has.property('date')
      done()
    })
  })

  it('Sample page', done => {
    createRequest('/doc/sample', res => {
      const data = parse(res)
      expect(data.errno).to.be.equal(0)
      expect(data).to.has.property('to')
      expect(data).to.has.property('title')
      expect(data).to.has.property('author')
      expect(data).to.has.property('date')
      expect(data).to.has.property('tags')
      expect(data).to.has.property('data')
      done()
    })
  })

  it('Handle error', done => {
    createRequest('/something', res => {
      const data = parse(res)
      expect(data.errno).to.be.equal(1)
      done()
    }, 'GET', 404)
  })
})
