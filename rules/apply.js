const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const matchesCondition = require('./matchesCondition')

module.exports = (rules, event) => {
  forEachSeries(rules, async (rule) => {
    if (!await matchesCondition(rule, event)) return
    console.log('rule triggered', rule)
  })
}
