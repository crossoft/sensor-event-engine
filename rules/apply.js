const _ = require('lodash')
const config = require('../config')
const isTriggered = require('./isTriggered')

module.exports = (event) => {
  _.each(config.rules, (rule) => {
    if (!isTriggered(rule, event)) return
    console.log('Rule triggered', rule)
  })
}
