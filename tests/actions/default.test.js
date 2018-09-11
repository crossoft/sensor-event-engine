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

test('when there is no actions key', async () => {
  const rule = {
    condition: {
      value: {
        name: 'temperature'
      },
      comparison: 'gt',
      threshold: 0
    },
  }

  const event = await Event.create({
    type: 'temperature',
    readings: [{
      name: 'temperature',
      value: 10,
    }],
  }, {
    include: [Sensor, Reading],
  })

  const cb = jest.fn()
  await apply([rule], event, cb)

  expect(cb).toBeCalledWith(rule)
})

test('when actions is empty', async () => {
  const rule = {
    condition: {
      value: {
        name: 'temperature'
      },
      comparison: 'gt',
      threshold: 0
    },
    actions: [],
  }

  const event = await Event.create({
    type: 'temperature',
    readings: [{
      name: 'temperature',
      value: 10,
    }],
  }, {
    include: [Sensor, Reading],
  })

  const cb = jest.fn()
  await apply([rule], event, cb)

  expect(cb).toBeCalledWith(rule)
})
