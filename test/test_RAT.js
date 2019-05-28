/* mocha */
const chai = require('chai')
const chaiHttp = require('chai-http')
let app = require('../app')

const expect = chai.expect

chai.use(chaiHttp)

describe('App', () => {
  describe('/healthCheak', () => {
    beforeEach(() => {
      app = require('../app')
    })
    afterEach(() => {
      app.close()
    })
    it('healthCheak status 408', (done) => {
      chai.request(app)
        .get('/healthCheak')
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(408)
          done()
        })
    })
    it('Send 100 request', (done) => {
      let requests = []
      for (let i = 0; i < 100; i++) {
        requests.push(chai.request(app).get('/healthCheak'))
      }
      Promise.all(requests)
        .then((response) => {
          const status = response.map(res => res.status)
          const status408 = status.filter(statusCode => statusCode === 408)
          const status429 = status.filter(statusCode => statusCode === 429)
          expect(status408).to.have.lengthOf(60)
          expect(status429).to.have.lengthOf(40)
          done()
        })
    })
    it('Send 60 request', (done) => {
      let requests = []
      for (let i = 0; i < 60; i++) {
        requests.push(chai.request(app).get('/healthCheak'))
      }
      Promise.all(requests)
        .then((response) => {
          const status = response.map(res => res.status)
          const status408 = status.filter(statusCode => statusCode === 408)
          expect(status408).to.have.lengthOf(60)
          done()
        })
    })
    it('Get requests number', (done) => {
      let requests = []
      for (let i = 0; i < 60; i++) {
        requests.push(chai.request(app).get('/'))
      }
      Promise.all(requests)
        .then((response) => {
          const status = response.map(res => res.status)
          const counters = response.map(res => parseInt(res.text))
          for (let i = 1; i <= 60; i++) {
            expect(counters).to.include(i)
          }
          const status200 = status.filter(statusCode => statusCode === 200)
          expect(status200).to.have.lengthOf(60)
          done()
        })
    })
  })
})
