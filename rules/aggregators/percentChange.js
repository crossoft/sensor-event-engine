const moment = require('moment')
const { Op } = require('sequelize')
const {
  Event,
  Reading,
} = require('../../db')
const getReadingValue = require('../getReadingValue')

module.exports = async (rule, event) => {
  const {
    condition: {
      value: {
        name,
        aggregate: {
          period: {
            unit,
            value,
          },
        },
      },
    },
  } = rule

  const comparisonEvent = await Event.findOne({
    where: {
      dateTime: {
        [Op.gte]: moment(event.dateTime).utc().subtract(value, unit).format(),
      },
    },
    order: [['dateTime', 'ASC']],
    include: [Reading],
  })

  const oldValue = await getReadingValue(comparisonEvent, name)
  const newValue = await getReadingValue(event, name)

  return ((newValue - oldValue) / oldValue) * 100.0
}
