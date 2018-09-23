const _ = require('lodash')
const uuidv1 = require('uuid/v1')
const moment = require('moment')

module.exports = (eventData) => (
  _.merge({
    sensorId: process.env.MOCK_EXTERNAL_ID || uuidv1(),
    signalStrength: _.random(0, 10),
    dateTimeUtc: moment.utc().format(),
  }, eventData)
)
