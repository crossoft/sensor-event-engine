const moment = require('moment')
const { Op } = require('sequelize')
const {
  Event,
  Reading,
} = require('../../../db')

module.exports = async ({
  scope: {
    event: {
      type,
    },
    reading,
  },
  condition: {
    aggregate: {
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
      type,
    },
    include: [{
      model: Reading,
      where: reading,
    }]
  })

  console.log('count', count)

  return count
}
