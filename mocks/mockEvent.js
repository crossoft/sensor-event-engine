const sendEvent = require('./sendEvent')
const withDefaults = require('./withDefaults')

const accelerometer = require('./events/accelerometer')
const battery = require('./events/battery')
const humidity = require('./events/humidity')
const motion = require('./events/motion')
const temperature = require('./events/temperature')

const events = {
  accelerometer,
  battery,
  humidity,
  motion,
  temperature,
}

module.exports = (eventType) => {
  const event = events[eventType]
  if (!event) throw `No event mock with type: ${eventType}`
  return sendEvent(withDefaults(event))
}
