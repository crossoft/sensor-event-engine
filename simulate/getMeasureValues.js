const _ = require('lodash')
const eventMocks = require('../mocks/events')

module.exports = (eventType, value) => (
  _.reduce(_.keys(eventMocks[eventType].measureValues), (memo, key) => {
    memo[key] = value
    return memo
  }, {})
)
