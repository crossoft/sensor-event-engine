const _ = require('lodash')
const sendEvent = require('./sendEvent')
const withDefaults = require('./withDefaults')

const accelerometer = require('./events/accelerometer')
const battery = require('./events/battery')
const humidity = require('./events/humidity')
const motion = require('./events/motion')
const temperature = require('./events/temperature')
const events = require('./events')

module.exports = (eventType, data = {}) => {
  const event = events[eventType]
  if (!event) throw `No event mock with type: ${eventType}`
  return sendEvent(_.merge(withDefaults(event), data))
}
