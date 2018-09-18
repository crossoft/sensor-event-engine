const types = require('./types')

module.exports = (config, rule, event) => (
  types[config.type](config, rule, event)
)
