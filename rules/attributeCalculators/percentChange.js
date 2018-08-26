const moment = require('moment')
const { Op } = require('sequelize')
const {
  Event,
  Reading,
} = require('../../db')
const number = require('./number')

module.exports = async ({
  period: {
    unit,
    value,
  },
  name,
}, event) => {
  const comparisonEvent = await Event.findOne({
    where: {
      dateTime: {
        [Op.gte]: moment(event.dateTime).utc().subtract(value, unit).format(),
      },
    },
    order: [['dateTime', 'ASC']],
    include: [Reading],
  })

  return ((number({ name }, event) - number({ name }, comparisonEvent)) / number({ name }, comparisonEvent)) * 100.0
}
