const express = require('express')
const app = express()
const moment = require('moment')

const rateLimitQueue = {}

app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (ip) {
    if (rateLimitQueue[ip] && rateLimitQueue[ip].length) {
      const nowTime = moment().unix()
      const rateQueue = rateLimitQueue[ip].filter(unixtime => unixtime > nowTime)
      if (rateQueue.length >= 60) {
        rateLimitQueue[ip] = [ ...rateQueue ]
        res.status(429).send('Error')
      } else {
        const newQueuedTime = moment().add(1, 'm').unix()
        rateLimitQueue[ip] = [ ...rateQueue, newQueuedTime ]
        next()
      }
    } else {
      const newQueuedTime = moment().add(1, 'm').unix()
      rateLimitQueue[ip] = [ newQueuedTime ]
      next()
    }
  } else {
    res.status(400).send(`Can't get remote address`)
  }
})

app.get('/healthCheak', (req, res) => {
  res.status(408).send()
})

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const nowTime = moment().unix()
  const rateQueue = rateLimitQueue[ip].filter(unixtime => unixtime > nowTime)
  if (rateQueue.length <= 60) {
    res.status(200).send(`${rateQueue.length}`)
  } else {
    res.status(429).send('Error')
  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app
