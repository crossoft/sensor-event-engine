const _ = require('lodash')
const aggregators = require('./aggregators')
const getReadingValue = require('./getReadingValue')

module.exports = (rule, event) => {
  const {
    condition: {
      name,
      aggregate,
    },
  } = rule

  if (_.isEmpty(aggregate)) return getReadingValue(event, name)

  return aggregators[aggregate.type](rule, event)
}
