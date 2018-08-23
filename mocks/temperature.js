const _ = require('lodash')
const sendEvent = require('./sendEvent')
const withDefaults = require('./withDefaults')

sendEvent(withDefaults({
  messageType: 'temperature',
  measureValues: {
    value: _.random(-40, 50),
  }
}))
