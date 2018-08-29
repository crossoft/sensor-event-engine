const moment = require('moment')
const { Op } = require('sequelize')
const _ = require('lodash')
const { filterSeries } = require('p-iteration')
const {
  Event,
  Reading,
} = require('../../db')
const compare = require('../compare')
const getReadingValue = require('../getReadingValue')

const eventsOverPeriod = ({
  scope: {
    event: {
      type,
    },
  },
  condition: {
    value: {
      aggregate: {
        period,
      },
    },
  },
}) => (
  Event.findAll({
    where: {
      type,
      ...periodWhere(period),
    },
    ...periodLimit(period),
    order: [['createdAt', 'DESC']],
    include: [{
      model: Reading,
    }]
  })
)

const dateTimeWhere = ({ value, unit }) => ({
  dateTime: {
    [Op.gte]: moment.utc().subtract(value, unit).format(),
  },
})

const periodWhere = (period) => {
  if (isEventsLimit(period)) return {}

  return dateTimeWhere(period)
}

const isEventsLimit = ({ unit }) => unit === 'events'

const periodLimit = (period) => {
  if (isEventsLimit(period)) return { limit: period.value }

  return {}
}

module.exports = async (rule) => {
  const events = await eventsOverPeriod(rule)

  const {
    condition: {
      value: {
        name,
        aggregate: {
          comparison,
          threshold,
        },
      },
    },
  } = rule

  if (!name) return events.length

  // console.log(_.map(_.flatMap(events, 'readings'), 'dataValues'))
  const filteredEvents = await filterSeries(events, async (event) => (
    compare(await getReadingValue(event, name), comparison, threshold)
  ))

  console.log('filtered', filteredEvents)

  return filteredEvents.length
}
