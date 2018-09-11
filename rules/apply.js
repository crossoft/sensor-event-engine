const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const matchesCondition = require('./matchesCondition')
const onMatch = require('./onMatch')
const onNoMatch = require('./onNoMatch')

module.exports = (rules, event, defaultAction) => (
  forEachSeries(rules, async (rule) => {
    if (await matchesCondition(rule, event)) {
      await onMatch(rule, event, defaultAction)
    } else {
      await onNoMatch(rule)
    }
  })
)
