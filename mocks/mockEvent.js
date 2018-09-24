const _ = require('lodash')
const sendEvent = require('./sendEvent')
const withDefaults = require('./withDefaults')

const accelerometer = require('./events/accelerometer')
const battery = require('./events/battery')
const humidity = require('./events/humidity')
const motion = require('./events/motion')
const temperature = require('./events/temperature')
const events = require('./events')

const WHITELISTED_DATA_KEYS = [
  'sensorId',
  'measureValues',
]

module.exports = (eventType, data = {}) => {
  const event = events[eventType]
  if (!event) throw `No event mock with type: ${eventType}`
  return sendEvent(_.merge(withDefaults(event), _.pick(data, WHITELISTED_DATA_KEYS)))
}
