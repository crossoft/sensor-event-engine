const _ = require('lodash')
const getAttributeValue = require('./getAttributeValue')
const compare = require('./compare')

module.exports = async (rule, event) => {
  const attributeValue = await getAttributeValue(rule, event)

  return compare(attributeValue, rule.condition.comparison,
    rule.condition.threshold)
}
