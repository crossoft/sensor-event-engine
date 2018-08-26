const _ = require('lodash')
const getConditionFunction = require('./getConditionFunction')
const getAttributeValue = require('./getAttributeValue')

const matchesCondition = async (condition, event) => {
  const fn = getConditionFunction(condition)
  const attributeValue = await getAttributeValue(condition.attribute, event)

  return fn(attributeValue, condition.threshold)
}

const isInScope = (scope, event) => (
  _.every(scope, (val, key) => val === event[key])
)

module.exports = async ({ scope, condition }, event) => {
  if (!isInScope(scope, event)) return
  if (!await matchesCondition(condition, event)) return

  return true
}
