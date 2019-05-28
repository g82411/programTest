/* mocha */
const chai = require('chai')
const chaiHttp = require('chai-http')
let app = require('../app')

const expect = chai.expect

chai.use(chaiHttp)

describe('App', () => {
  describe('/healthCheak', () => {
    it('healthCheak status 408', (done) => {
      chai.request(app)
        .get('/healthCheck')
        .set('X-Forwarded-For', '192.168.2.1')
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(408)
          done()
        })
    })
    it('Send 100 request', (done) => {
      let requests = []
      for (let i = 0; i < 100; i++) {
        requests.push(chai.request(app).get('/healthCheck').set('X-Forwarded-For', '192.168.3.1'))
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
    }).timeout(8000)
    it('Send 60 request', (done) => {
      let requests = []
      for (let i = 0; i < 60; i++) {
        requests.push(chai.request(app).get('/healthCheck').set('X-Forwarded-For', '192.168.4.1'))
      }
      Promise.all(requests)
        .then((response) => {
          const status = response.map(res => res.status)
          const status408 = status.filter(statusCode => statusCode === 408)
          expect(status408).to.have.lengthOf(60)
          done()
        })
    }).timeout(8000)
    it('Get requests number', (done) => {
      let requests = []
      for (let i = 0; i < 60; i++) {
        requests.push(chai.request(app).get('/').set('X-Forwarded-For', '192.168.5.1'))
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
    }).timeout(8000)
  })
})
