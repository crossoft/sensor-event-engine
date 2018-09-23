const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const moment = require('moment')
const sleep = require('sleep-promise')
const uuidv1 = require('uuid/v1')
const mockEvent = require('../mocks/mockEvent')

module.exports = async ({ normalValue, normalDuration, peakValue, peakDuration }) => {
  const stepsMovementCount = 3
  const stepSize = (peakValue - normalValue) / stepsMovementCount

  const steps = _.flatten([
    _.times(stepsMovementCount, (n) => ({
      value: normalValue + n * stepSize,
      duration: normalDuration / stepsMovementCount,
    })),
    {
      value: peakValue,
      duration: peakDuration,
    },
    _.times(stepsMovementCount, (n) => ({
      value: peakValue - (n + 1) * stepSize,
      duration: normalDuration / stepsMovementCount,
    })),
  ])

  console.log('> Simulation plan:')
  _.each(steps, ({ value, duration }) => {
    console.log(`| Temperature event: ${_.round(value, 1)}; Wait ${_.round(duration, 1)}mins`)
  })
  console.log('> Executing...')

  const sensorId = process.env.MOCK_EXTERNAL_ID || uuidv1()

  await forEachSeries(steps, async ({ value, duration }) => {
    await mockEvent('temperature', {
      sensorId,
      measureValues: {
        temperature: value,
      },
    })

    const milliseconds = moment.duration(duration, 'minutes').as('milliseconds')
    console.log(`> Waiting for ${_.round(duration, 1)} minutes...`)
    await sleep(milliseconds)
  })
}
