const _ = require('lodash')
const {
  Event,
  Reading,
} = require('../db')
const toTable = require('./toTable')

const formatReadings = (readings) => (
  _.map(readings, ({ name, value }) => `${name}: ${value}`).join('; ')
)

const formatEvent = (event) => ({
  ..._.omit(event.dataValues, 'createdAt', 'updatedAt'),
  readings: formatReadings(event.readings),
})

module.exports = async () => {
  const events = await Event.findAll({ include: [Reading] })
  const formattedEvents = _.map(events, formatEvent)
  const head = _.keys(formattedEvents[0])

  console.log(toTable(head, formattedEvents))
}
