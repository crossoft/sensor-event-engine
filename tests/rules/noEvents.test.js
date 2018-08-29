const moment = require('moment')
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
        aggregate: {
          type: 'count',
          period: {
            value: 5,
            unit: 'minutes'
          }
        }
      },
      comparison: 'eq',
      threshold: 0
    },
  }

  await Event.create({
    dateTime: moment().subtract(6, 'minutes').format(),
  }, {
    include: [Sensor, Reading],
  })

  const cb = jest.fn()
  await apply([rule], null, cb)

  expect(cb).toBeCalledWith(rule)
})

test('should not be called', async () => {
  const rule = {
    condition: {
      value: {
        aggregate: {
          type: 'count',
          period: {
            value: 5,
            unit: 'minutes'
          }
        }
      },
      comparison: 'eq',
      threshold: 0
    },
  }

  await Event.create({
    dateTime: moment().subtract(4, 'minutes').format(),
  }, {
    include: [Sensor, Reading],
  })

  const cb = jest.fn()
  await apply([rule], null, cb)

  expect(cb).not.toBeCalled()
})
