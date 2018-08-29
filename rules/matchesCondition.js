const _ = require('lodash')
const getAttributeValue = require('./getAttributeValue')
const compare = require('./compare')

const isInEventScope = (scope, event) => (
  _.every(scope, (val, key) => event[key] === val)
)

const isInScope = ({ scope = {} }, event) => (
  _.every(scope, (val, key) => {
    if (key === 'event') return isInEventScope(val, event)
    throw `Scope of ${key} is not supported`
  })
)

module.exports = async (rule, event) => {
  if (event && !isInScope(rule, event)) return false

  const attributeValue = await getAttributeValue(rule, event)

  return compare(attributeValue, rule.condition.comparison,
    rule.condition.threshold)
}
