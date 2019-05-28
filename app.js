const express = require('express')
const app = express()

app.get('/healthCheak', function (req, res) {
  res.status(408)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app
