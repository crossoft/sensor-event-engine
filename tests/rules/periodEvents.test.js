const moment = require('moment')
const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const {
  db,
  Event,
  Sensor,
  Reading,
} = require('../../db')
const apply = require('../../rules/apply')

beforeEach(async () => {
  await db.sync({ force: true })
})

test('should be called', async () => {
  const rule = {
    condition: {
      value: {
        name: 'signalStrength',
        aggregate: {
          type: 'count',
          period: {
            value: 5,
            unit: 'events'
          },
          comparison: 'lt',
          threshold: -5
        }
      },
      comparison: 'eq',
      threshold: 5
    },
  }

  await forEachSeries(_.times(5), async (n) => {
    await Event.create({
      readings: [{
        name: 'signalStrength',
        value: -6 * (n + 1),
      }],
    }, {
      include: [Sensor, Reading],
    })
  })

  const cb = jest.fn()
  await apply([rule], null, cb)

  expect(cb).toBeCalledWith(rule)
})

test('should not be called', async () => {
  const rule = {
    condition: {
      value: {
        name: 'signalStrength',
        aggregate: {
          type: 'count',
          period: {
            value: 5,
            unit: 'events'
          },
          comparison: 'lt',
          threshold: -10
        }
      },
      comparison: 'eq',
      threshold: 5
    },
  }

  await forEachSeries(_.times(5), async (n) => {
    await Event.create({
      readings: [{
        name: 'signalStrength',
        value: -6 * (n + 1),
      }],
    }, {
      include: [Sensor, Reading],
    })
  })

  const cb = jest.fn()
  await apply([rule], null, cb)

  expect(cb).not.toBeCalled()
})
