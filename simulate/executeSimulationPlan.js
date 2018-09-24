const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const moment = require('moment')
const sleep = require('sleep-promise')

const mockEvent = require('../mocks/mockEvent')
const getMeasureValues = require('./getMeasureValues')

module.exports = (steps, { eventType, signalStrengthFollows, sensorId }) => (
  forEachSeries(steps, async ({ value, duration }) => {
    await mockEvent(eventType, _.merge(
      { sensorId },
      { measureValues: getMeasureValues(eventType, value) },
      signalStrengthFollows ? { signalStrength: value } : {},
    ))

    const milliseconds = moment.duration(duration, 'minutes').as('milliseconds')
    console.log(`> Waiting for ${_.round(duration, 1)} minutes...`)
    await sleep(milliseconds)
  })
)
