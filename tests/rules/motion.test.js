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
        name: 'motion'
      },
      comparison: 'eq',
      threshold: '1',
    }
  }

  const event = await Event.create({
    type: 'motion',
    readings: [{
      name: 'motion',
      value: true,
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
        name: 'motion'
      },
      comparison: 'eq',
      threshold: '1',
    }
  }

  const event = await Event.create({
    readings: [{
      name: 'motion',
      value: false,
    }],
  }, {
    include: [Sensor, Reading],
  })

  const cb = jest.fn()
  await apply([rule], event, cb)

  expect(cb).not.toBeCalled()
})
