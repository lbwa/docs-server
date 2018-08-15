const request = require('supertest')
const chalk = require('chalk')
const App = require('../dist/index')
const app = require('../sample/dev')

describe(`${chalk.yellow.bold('TEST')}: Application, including routes filter\n`, () => {
  let etag = ''
  before(done => {
    app.genPromise.then(() => done())
  })

  after(done => {
    Promise.resolve(app.server.close())
      .then(() => done())
  })

  it('GET: check response header generated by headerMiddleware', done => {
    request(app.server)
      .get('/')
      .expect(200)
      .expect('Access-Control-Allow-Origin', 'http://127.0.0.1:8800')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('Content-Encoding', 'gzip')
      .end((err, res) => {
        if (err) throw err
        etag = res.header.etag
        done()
      })
  })
  it('GET: check 304 response', done => {
    request(app.server)
      .get('/')
      .set('if-none-match', etag)
      .expect(304)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })

  // Make sure this function invoked after generator complete mission,
  // otherwise gen.contentList is empty storage
  it('GET: /writings/doc/sample', done => {
    request(app.server)
      .get('/writings/doc/sample')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        if (res.body.errno !== 0) throw new Error('[Error]: errno doesn\'t equal 0 !')
        done()
      })
  })

  it('GET: /writings/doc/nest/sample', done => {
    request(app.server)
      .get('/writings/doc/nest/sample')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        if (res.body.errno !== 0) throw new Error('[Error]: errno doesn\'t equal 0 !')
        done()
      })
  })

  it('GET: menu.json', done => {
    request(app.server)
      .get('/menu')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        if (res.body[0].errno !== 0) throw new Error('[Error]: errno doesn\'t equal 0 !')
        done()
      })
  })

  it('GET: extra static resources routes', done => {
    request(app.server)
      .get('/test')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        if (res.body.errno !== 0) throw new Error('[Error]: errno doesn\'t equal 0 !')
        done()
      })
  })

  it('Handle url error', done => {
    request(app.server)
      .get('/something')
      .expect(404, {
        errno: 1,
        message: "[Error]: Invalid request"
      })
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })

  it('Handle method error', done => {
    request(app.server)
      .post('/doc/sample')
      .expect(405)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
})

describe(`${chalk.yellow.bold('TEST')}: Headers options\n`, () => {
  let app
  before(done => {
    app = new App({
      headers: {
        'Access-Control-Allow-Methods': 'GET,POST'
      },
      filter: (origin) => {
        const removeExtension = origin.replace(/\.md$/, '')
        return `writings/${removeExtension}`
      },
    })

    app.genPromise.then(() => done())
  })

  after(done => {
    Promise.resolve(app.server.close())
      .then(() => done())
  })

  it('GET: Check response headers', done => {
    request(app.server)
      .get('/')
      .expect(200)
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
})
