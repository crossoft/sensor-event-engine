const _ = require('lodash')
const config = require('../config')
const apply = require('./apply')
const isPeriodical = require('./isPeriodical')

module.exports = () => apply(_.filter(config.rules, isPeriodical))
