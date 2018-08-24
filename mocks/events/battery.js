const _ = require('lodash')

module.exports = {
  messageType: 'battery',
  measureValues: {
    value: _.random(0, 100),
  }
}
