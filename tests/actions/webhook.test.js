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

test('multiple webhooks', async () => {
  const config1 = {
    type: 'webhook',
    url: 'https://webhook-endpoint-1.com/temperature',
  }

  const config2 = {
    type: 'webhook',
    url: 'https://webhook-endpoint-2.com/temperature',
  }

  const rule = {
    condition: {
      value: {
        name: 'temperature'
      },
      comparison: 'gt',
      threshold: 0
    },
    actions: [config1, config2],
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

  expect(fetch).toBeCalledWith(config1.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rule,
      event,
    }),
  })

  expect(fetch).toBeCalledWith(config2.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rule,
      event,
    }),
  })
})
