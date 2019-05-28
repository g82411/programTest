const express = require('express')
const app = express()
const redis = require('redis')
const config = require('./config.json')

const REDISHOST = process.env.REDISHOST || config.redis.host
const REDISPORT = process.env.REDISPORT || config.redis.port

const redisClient = redis.createClient(REDISPORT, REDISHOST)
const lock = require('redis-lock')(redisClient)

app.enable('trust proxy')
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (ip) {
    lock(ip, (done) => {
      redisClient.hgetall(ip, (err, cache) => {
        if (err) {
          console.log(err)
          res.status(500).send('Server side error')
        }
        if (cache) {
          const { counter: counterString } = cache
          const counter = parseInt(counterString)
          if (counter >= 60) {
            done()
            res.status(429).send('Error')
          } else {
            const newCounter = counter + 1
            redisClient.hmset(ip, { counter: newCounter })
            done()
            next()
          }
        } else {
          redisClient.hmset(ip, { counter: 1 })
          redisClient.expire(ip, 60)
          done()
          next()
        }
      })
    })
  } else {
    res.status(400).send(`Can't get remote address`)
  }
})

app.get('/healthCheck', (req, res) => {
  res.status(408).send()
})

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  redisClient.hgetall(ip, (err, cache) => {
    if (err) {
      console.log(err)
      res.status(500).send('Server side error')
    }
    if (cache) {
      const { counter: counterString } = cache
      const counter = parseInt(counterString)
      if (counter > 60) {
        res.status(429).send('Error')
      } else {
        res.status(200).send(`${counter}`)
      }
    } else {
      res.status(200).send(`0`)
    }
  })
})
const port = process.env.PORT || 8080
app.listen(port, function () {
  console.log(`App listening on port ${port}!`)
})

module.exports = app
