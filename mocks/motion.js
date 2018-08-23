const _ = require('lodash')
const sendEvent = require('./sendEvent')
const withDefaults = require('./withDefaults')

sendEvent(withDefaults({
  messageType: 'motion',
  measureValues: {
    value: _.sample([true, false]),
  }
}))
