const _ = require('lodash')

module.exports = {
  messageType: 'humidity',
  measureValues: {
    humidity: _.random(0, 100),
  }
}
