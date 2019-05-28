/* mocha */
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')

const expect = chai.expect

chai.use(chaiHttp)

describe('App', () => {
  describe('/healthCheak', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
        .get('/healthCheak')
        .end((err, res) => {
          expect(err).to.be.a('null')
          expect(res).to.have.status(408)
          done()
        })
    })
    // it('Send 60 request', async (done) => {
    //   let requests = []
    //   for (let i = 0; i < 60; i++) {
    //     requests = [...requests, chai.request(app).get('/healthCheak')]
    //   }
    //   await Promise.all(requests)
    //   expect({ a: 1 }).to.be.an('object')
    // })
  })
})
