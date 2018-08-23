const _ = require('lodash')
const sendEvent = require('./sendEvent')
const withDefaults = require('./withDefaults')

sendEvent(withDefaults({
  messageType: 'accelerometer',
  measureValues: {
    x: _.random(-300, 300, true),
    y: _.random(-300, 300, true),
    z: _.random(-300, 300, true),
  }
}))
