const _ = require('lodash')
const getComparisonFn = require('./getComparisonFn')
const getAttributeValue = require('./getAttributeValue')

module.exports = async (rule, event) => {
  const comparisonFn = getComparisonFn(rule)
  const attributeValue = await getAttributeValue(rule, event)

  return comparisonFn(attributeValue, rule.condition.threshold)
}
