const _ = require('lodash')
const config = require('../config')
const apply = require('./apply')
const isPeriodical = require('./isPeriodical')

module.exports = (event) => (
  apply(_.reject(config.rules, isPeriodical), event)
)
