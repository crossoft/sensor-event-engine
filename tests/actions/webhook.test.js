const {
  db,
  Event,
  Sensor,
  Reading,
} = require('../../db')

beforeEach(async () => {
  await db.sync({ force: true })
})

test('with url only', async () => {
  const config = {
    type: 'webhook',
    url: 'https://webhook-endpoint.com/temperature',
  }

  const rule = {
    condition: {
      value: {
        name: 'temperature'
      },
      comparison: 'gt',
      threshold: 0
    },
    actions: [config],
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

  jest.mock('node-fetch')
  const fetch = require('node-fetch')
  const apply = require('../../rules/apply')
  await apply([rule], event)

  expect(fetch).toBeCalledWith(config.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rule,
      event,
    }),
  })
})
