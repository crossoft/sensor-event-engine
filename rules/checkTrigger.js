const _ = require('lodash')
const config = require('../config')
const apply = require('./apply')
const isPeriodical = require('./isPeriodical')

const isInScope = (event, rule) => rule.condition.eventType === event.type

module.exports = (event) => (
  apply(_.filter(_.reject(config.rules, isPeriodical), {
    condition: {
      eventType: event.type,
    },
  }), event)
)
