const request = require('supertest')
const resolve = require('path').resolve
const App = require('../dist/index')

describe('TEST: Application', () => {
  let app
  before(done => {
    app = new App({
      cwd: resolve(__dirname, '../'),
      dest: resolve(__dirname, '../menu.json'),
      port: '3000',
      extra: [
        {
          route: '/test',
          middleware: async (ctx, next) => {
            ctx.status = 200
            ctx.body = JSON.stringify({
              errno: 0,
              msg: 'test route'
            })
            /**
             * Don't miss setting response header, otherwise response MIME type
             * is text/plain that will cause supertest get a empty object
             * rather than a correct object
             */
            ctx.set({
              'Content-Type': 'application/json; charset=utf-8'
            })
          }
        }
      ]
    })

    app.genPromise.then(() => done())
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

  // Make sure this function invoked after generator complete mission,
  // otherwise gen.contentList is empty storage
  it('GET: doc/sample', done => {
    request(app.server)
      .get('/doc/sample')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        if (res.body.errno !== 0) throw new Error('[Error]: errno doesn\'t equal 0 !')
        done()
      })
  })

  it('GET: doc/nest/sample', done => {
    request(app.server)
      .get('/doc/nest/sample')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        if (res.body.errno !== 0) throw new Error('[Error]: errno doesn\'t equal 0 !')
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
