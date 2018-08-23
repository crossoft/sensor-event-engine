const uuidv1 = require('uuid/v1')
const moment = require('moment')
const _ = require('lodash')
const sendEvent = require('./sendEvent')

sendEvent({
  "sensorId" : process.env.MOCK_EXTERNAL_ID || uuidv1(),
  "messageType" : "temperature",
  "signalStrength" : _.random(0, 10),
  "dateTimeUtc" : moment.utc().format(),
  "measureValues" : {
    "max" : _.random(10, 20),
    "min" : _.random(0, 10),
  }
})
