const _ = require('lodash')
const { everySeries } = require('p-iteration')
const getAttributeValue = require('./getAttributeValue')
const compare = require('./compare')

const isInRecordScope = (scope, record) => (
  _.every(scope, (val, key) => record[key] === val)
)

const isInScope = ({ scope = {} }, event) => (
  everySeries(_.keys(scope), async (key) => {
    if (key === 'event') return isInRecordScope(scope[key], event)
    if (key === 'sensor') return isInRecordScope(scope[key], await event.getSensor())
    if (key === 'device') {
      const sensor = await event.getSensor()
      const device = await sensor.getDevice()
      if (!device) return false

      return isInRecordScope(scope[key], device)
    }
    if (key === 'zone') {
      const sensor = await event.getSensor()
      const zone = await sensor.getZone()
      if (!zone) return false

      return isInRecordScope(scope[key], zone)
    }

    throw `Scope of ${key} is not supported`
  })
)

module.exports = async (rule, event) => {
  if (event && !await isInScope(rule, event)) return false

  const attributeValue = await getAttributeValue(rule, event)

  return compare(attributeValue, rule.condition.comparison,
    rule.condition.threshold)
}
