const _ = require('lodash')
const getConditionFunction = require('./getConditionFunction')

const matchesCondition = (condition, event) => (
  getConditionFunction(condition)(condition, event)
)

const isInScope = (scope, event) => (
  _.every(scope, (val, key) => val === event[key])
)

module.exports = ({ scope, condition }, event) => {
  if (!isInScope(scope, event)) return
  if (!matchesCondition(condition, event)) return

  return true
}
