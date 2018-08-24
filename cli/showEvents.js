const _ = require('lodash')
const Table = require('cli-table2')
const {
  Event,
  Reading,
} = require('../db')

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

  const table = new Table({ head })
  _.each(formattedEvents, event => {
    table.push(_.values(_.map(event, _.toString)))
  })

  console.log(table.toString())
}
