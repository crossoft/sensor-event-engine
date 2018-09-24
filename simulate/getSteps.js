const _ = require('lodash')
const normalValue = require('./normalValue')

module.exports = (opts) => {
  const {
    stepsTillPeak,
    normalDuration,
    peakValue,
    peakDuration,
    withReturnToNormal,
  } = opts

  return _.compact(_.flatten([
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
}
