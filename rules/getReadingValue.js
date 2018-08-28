const _ = require('lodash')

module.exports = (event, name) => (
  _.find(event.readings, { name }).value
)
