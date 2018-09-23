const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const moment = require('moment')
const sleep = require('sleep-promise')
const uuidv1 = require('uuid/v1')
const mockEvent = require('../mocks/mockEvent')

module.exports = async (eventType, { min, max, peak, valley }) => {
  const stepsMovementCount = 3
  const stepSize = (max - min) / stepsMovementCount

  const steps = _.flatten([
    _.times(stepsMovementCount, (n) => ({
      value: min + n * stepSize,
      duration: valley / stepsMovementCount,
    })),
    {
      value: max,
      duration: peak,
    },
    _.times(stepsMovementCount, (n) => ({
      value: max - (n + 1) * stepSize,
      duration: valley / stepsMovementCount,
    })),
  ])

  const sensorId = process.env.MOCK_EXTERNAL_ID || uuidv1()

  await forEachSeries(steps, async ({ value, duration }) => {
    await mockEvent('temperature', {
      sensorId,
      measureValues: {
        temperature: value,
      },
    })

    const milliseconds = moment.duration(duration, 'minutes').as('milliseconds')
    console.log(`Waiting for ${duration} minutes (${milliseconds} milliseconds)`)
    await sleep(milliseconds)
  })
}
