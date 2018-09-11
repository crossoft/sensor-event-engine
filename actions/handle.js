const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const execute = require('./execute')
const defaultTypeFn = require('./types/default')

module.exports = (rule, event, defaultFn = defaultTypeFn) => {
  const configs = rule.actions || []
  if (_.isEmpty(configs)) return defaultFn(rule)

  forEachSeries(configs, (config) => execute(config, rule, event))
}
