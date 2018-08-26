const _ = require('lodash')
const config = require('../config')
const isTriggered = require('./isTriggered')

module.exports = (event) => {
  _.each(config.rules, async (rule) => {
    if (!await isTriggered(rule, event)) return
    console.log('Rule triggered', rule)
  })
}
