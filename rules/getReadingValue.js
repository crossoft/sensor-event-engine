const _ = require('lodash')
const {
  Reading,
} = require('../db')

module.exports = async (event, name) => {
  const reading = await Reading.findOne({
    where: {
      eventId: event.id,
      name,
    },
  })

  if (!reading) throw `Missing reading ${name} on Event#${event.id}`

  return reading.value
}
