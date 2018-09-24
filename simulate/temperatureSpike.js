const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const moment = require('moment')
const sleep = require('sleep-promise')
const uuidv1 = require('uuid/v1')
const mockEvent = require('../mocks/mockEvent')

const STEPS_TILL_PEAK = 3

const stepSize = (normalValue, peakValue) => (
  (peakValue - normalValue) / STEPS_TILL_PEAK
)

const getNormalValue = (n, isBeforePeak, { changeFunction, normalValue, peakValue }) => {
  if (changeFunction === 'abrupt') return normalValue

  if (isBeforePeak) {
    return normalValue + n * stepSize(normalValue, peakValue)
  } else {
    return peakValue - (n + 1) * stepSize(normalValue, peakValue)
  }
}

module.exports = async (opts) => {
  const {
    normalDuration,
    peakValue,
    peakDuration,
  } = opts

  const steps = _.flatten([
    _.times(STEPS_TILL_PEAK, (n) => ({
      value: getNormalValue(n, false, opts),
      duration: normalDuration / STEPS_TILL_PEAK,
    })),
    {
      value: peakValue,
      duration: peakDuration,
    },
    _.times(STEPS_TILL_PEAK, (n) => ({
      value: getNormalValue(n, true, opts),
      duration: normalDuration / STEPS_TILL_PEAK,
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
