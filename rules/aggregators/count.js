const moment = require('moment')
const { Op } = require('sequelize')
const _ = require('lodash')
const { filterSeries } = require('p-iteration')
const {
  Event,
  Reading,
  Sensor,
  Device,
} = require('../../db')
const compare = require('../compare')
const getReadingValue = require('../getReadingValue')

const scopeWhere = (scope) => _.get(scope, 'event') || {}

const scopeInclude = (scope) => (
  _.map(_.omit(scope, ['event']), (where, key) => {
    if (key === 'sensor') return { model: Sensor, where }
    if (key === 'device') return { model: Sensor, include: [{ model: Device, where }] }

    throw `Missing model ${name} from scope`
  })
)

const eventsOverPeriod = ({
  scope,
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
      ...scopeWhere(scope),
      ...periodWhere(period),
    },
    ...periodLimit(period),
    order: [['createdAt', 'DESC']],
    include: [{ model: Reading }].concat(scopeInclude(scope))
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

  const filteredEvents = await filterSeries(events, async (event) => (
    compare(await getReadingValue(event, name), comparison, threshold)
  ))

  return filteredEvents.length
}
