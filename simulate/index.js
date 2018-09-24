const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const moment = require('moment')
const sleep = require('sleep-promise')
const mockEvent = require('../mocks/mockEvent')
const normalValue = require('./normalValue')
const getMeasureValues = require('./getMeasureValues')

module.exports = async (opts) => {
  const {
    eventType,
    normalDuration,
    peakValue,
    peakDuration,
    withReturnToNormal,
    signalStrengthFollows,
    sensorId,
    stepsTillPeak,
  } = opts

  const steps = _.compact(_.flatten([
    _.times(stepsTillPeak, (n) => ({
      value: normalValue(n, true, opts),
      duration: normalDuration,
    })),
    {
      value: peakValue,
      duration: peakDuration,
    },
    withReturnToNormal && _.times(stepsTillPeak, (n) => ({
      value: normalValue(n, false, opts),
      duration: normalDuration,
    })),
  ]))

  console.log('> Simulation plan:')
  _.each(steps, ({ value, duration }) => {
    const signalStrengthPart = signalStrengthFollows && ` "signalStrength": ${_.round(value, 1)};`
    console.log(`| "${eventType}" event: ${_.round(value, 1)};${signalStrengthPart} Wait ${_.round(duration, 1)}mins`)
  })
  console.log('> Executing...')

  await forEachSeries(steps, async ({ value, duration }) => {
    await mockEvent(eventType, _.merge(
      { sensorId },
      { measureValues: getMeasureValues(eventType, value) },
      signalStrengthFollows ? { signalStrength: value } : {},
    ))

    const milliseconds = moment.duration(duration, 'minutes').as('milliseconds')
    console.log(`> Waiting for ${_.round(duration, 1)} minutes...`)
    await sleep(milliseconds)
  })
}
