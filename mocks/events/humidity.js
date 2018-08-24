const _ = require('lodash')

module.exports = ({
  messageType: 'humidity',
  measureValues: {
    value: _.random(0, 100),
  }
})
