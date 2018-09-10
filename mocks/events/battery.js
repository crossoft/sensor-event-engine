const _ = require('lodash')

module.exports = {
  messageType: 'battery',
  measureValues: {
    battery: _.random(0, 100),
  }
}
