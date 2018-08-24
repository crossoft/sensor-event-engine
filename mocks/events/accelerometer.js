const _ = require('lodash')

module.exports = () => ({
  messageType: 'accelerometer',
  measureValues: {
    x: _.random(-300, 300, true),
    y: _.random(-300, 300, true),
    z: _.random(-300, 300, true),
  }
})
