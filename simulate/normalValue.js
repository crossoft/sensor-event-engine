const stepSize = require('./stepSize')

module.exports = (n, isBeforePeak, opts) => {
  const {
    changeFunction,
    normalValue,
    peakValue,
  } = opts

  if (changeFunction === 'abrupt') return normalValue

  if (isBeforePeak) {
    return normalValue + n * stepSize(opts)
  } else {
    return peakValue - (n + 1) * stepSize(opts)
  }
}
