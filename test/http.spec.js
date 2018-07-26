const request = require('supertest')
const App = require('../dist/index')

describe('TEST: Application', () => {
  let app
  before(done => {
    app = new App()
    Promise.resolve(app)
      .then(() => done())
  })

  after(done => {
    Promise.resolve(app.server.close())
      .then(() => done())
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

  it('GET: Home', done => {
    request(app.server)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })

  // Make sure this function invoked after generator complete mission,
  // otherwise gen.contentList is empty storage
  it('GET: doc/sample', done => {
    // app.genPromise must be resolved before testing
    app.genPromise.then(() => {
      request(app.server)
      .get('/doc/sample')
      .expect(200, {
        errno: 0,
        to: "doc/sample",
        title: "Hello world",
        author: "Bowen",
        date: "2018 AUG 01",
        tags: [
        "Javascript",
        "Typescript"
        ],
        data: "\r\nThis is content of posts.\r\n"
      })
      .end((err, res) => {
        if (err) throw err
        done()
      })
    })
  })
})
