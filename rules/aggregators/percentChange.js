const moment = require('moment')
const { Op } = require('sequelize')
const {
  Event,
  Reading,
} = require('../../../db')
const number = require('./number')

module.exports = async (rule, event) => {
  const {
    condition: {
      attribute: {
        period: {
          unit,
          value,
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

  const oldValue = number(rule, comparisonEvent)
  const newValue = number(rule, event)

  return ((newValue - oldValue) / oldValue) * 100.0
}
