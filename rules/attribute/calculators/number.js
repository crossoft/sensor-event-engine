const _ = require('lodash')

module.exports = ({
  condition: {
    attribute: {
      name,
    },
  },
}, event) => (
  _.find(event.readings, { name }).value
)
