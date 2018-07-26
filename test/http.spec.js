const request = require('supertest')
const App = require('../dist/index')

describe('Build Server', () => {
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

  it('GET: Home', done => {
    request(app.server)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
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

  // Make sure this function invoked after generator complete mission,
  // otherwise gen.contentList is empty storage
  it('GET: doc/sample', done => {
    request(app.server)
      .get('/doc/sample')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        done()
      })
  })
})
