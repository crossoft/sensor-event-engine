const _ = require('lodash')
const sendEvent = require('./sendEvent')
const withDefaults = require('./withDefaults')

sendEvent(withDefaults({
  messageType: 'battery',
  measureValues: {
    value: _.random(0, 100),
  }
}))
