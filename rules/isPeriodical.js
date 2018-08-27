const _ = require('lodash')

module.exports = (rule) => _.get(rule, 'condition.periodical')
