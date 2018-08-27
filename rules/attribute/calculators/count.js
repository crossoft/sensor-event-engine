const moment = require('moment')
const { Op } = require('sequelize')
const {
  Event,
} = require('../../../db')

module.exports = async ({
  condition: {
    eventType,
    attribute: {
      period: {
        unit,
        value,
      },
    },
  },
}) => {
  const count = await Event.count({
    where: {
      dateTime: {
        [Op.gte]: moment.utc().subtract(value, unit).format(),
      },
      type: eventType,
    },
  })

  console.log('final count', count)
  return count
}
