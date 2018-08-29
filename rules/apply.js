const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const matchesCondition = require('./matchesCondition')

const defaultTrigger = (rule) => {
  console.log('Rule triggered:', rule)
}

module.exports = (rules, event, trigger = defaultTrigger) => (
  forEachSeries(rules, async (rule) => {
    if (!await matchesCondition(rule, event)) return
    trigger(rule)
  })
)
