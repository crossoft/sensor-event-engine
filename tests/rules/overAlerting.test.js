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
        name: 'temperature'
      },
      comparison: 'gt',
      threshold: 0
    }
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

test('should not be called', async () => {
  const rule = {
    condition: {
      value: {
        name: 'temperature'
      },
      comparison: 'gt',
      threshold: 0
    }
  }

  const event = await Event.create({
    readings: [{
      name: 'temperature',
      value: 10,
    }],
  }, {
    include: [Sensor, Reading],
  })

  const cb = jest.fn()
  await apply([rule], event, cb)

  const event2 = await Event.create({
    readings: [{
      name: 'temperature',
      value: 20,
    }],
  }, {
    include: [Sensor, Reading],
  })

  const cb2 = jest.fn()
  await apply([rule], event, cb2)

  expect(cb2).not.toBeCalled()
})
