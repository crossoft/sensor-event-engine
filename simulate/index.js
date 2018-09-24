const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const moment = require('moment')
const sleep = require('sleep-promise')
const mockEvent = require('../mocks/mockEvent')
const eventMocks = require('../mocks/events')

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

const getMeasureValues = (eventType, value) => (
  _.reduce(_.keys(eventMocks[eventType].measureValues), (memo, key) => {
    memo[key] = value
    return memo
  }, {})
)

module.exports = async (opts) => {
  const {
    eventType,
    normalDuration,
    peakValue,
    peakDuration,
    withReturnToNormal,
    signalStrengthFollows,
    sensorId,
  } = opts

  const steps = _.compact(_.flatten([
    _.times(STEPS_TILL_PEAK, (n) => ({
      value: getNormalValue(n, true, opts),
      duration: normalDuration / STEPS_TILL_PEAK,
    })),
    {
      value: peakValue,
      duration: peakDuration,
    },
    withReturnToNormal && _.times(STEPS_TILL_PEAK, (n) => ({
      value: getNormalValue(n, false, opts),
      duration: normalDuration / STEPS_TILL_PEAK,
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
