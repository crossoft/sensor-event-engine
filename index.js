const express = require('express')
const bodyParser = require('body-parser')
const createEvents = require('./events/create')
const listenToPeriodicalRules = require('./rules/listenPeriodical')

const app = express()

app.use(bodyParser.json())
app.post('/events', createEvents)

const port = 3000
const opts = {
  port,
  cors: {
    credentials: true,
  },
}

app.listen(port, () => console.log(`Server is running and receives POST events at localhost:${port}/events`))
listenToPeriodicalRules()
