const _ = require('lodash')
const extractSignalStrengthEvent = require('./extractSignalStrengthEvent')

module.exports = (data) => {
  const result = _.map(data.measureValues, (value, name) => ({
    name,
    value,
  }))

  result.push(extractSignalStrengthEvent(data))
  return result
}
