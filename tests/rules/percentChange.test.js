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

test('basic should be called', async () => {
  const rule = {
    condition: {
      value: {
        name: 'temperature',
        aggregate: {
          type: 'percentChange',
          period: {
            value: 5,
            unit: 'days'
          }
        }
      },
      comparison: 'gt',
      threshold: 100
    },
  }

  await Event.create({
    type: 'temperature',
    dateTime: moment().subtract(4, 'days').format(),
    readings: [{
      name: 'temperature',
      value: 10,
    }],
  }, {
    include: [Sensor, Reading],
  })

  const event = await Event.create({
    type: 'temperature',
    readings: [{
      name: 'temperature',
      value: 21,
    }],
  }, {
    include: [Sensor, Reading],
  })

  const cb = jest.fn()
  await apply([rule], event, cb)

  expect(cb).toBeCalledWith(rule)
})
