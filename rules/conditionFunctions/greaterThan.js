const _ = require('lodash')

module.exports = ({ value, compareWith }, { readings }) => {
  console.log('greated', readings[0].value, compareWith, value)
  const comparableReadings = _.filter(readings, { name: compareWith })

  return _.some(comparableReadings, (reading) => (
    _.gt(reading.value, value)
  ))
}
