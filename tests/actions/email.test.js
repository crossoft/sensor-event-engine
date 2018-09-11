const _ = require('lodash')
const {
  db,
  Event,
  Sensor,
  Reading,
} = require('../../db')

beforeEach(async () => {
  await db.sync({ force: true })
})

test('with one action', async () => {
  const config = {
    type: 'email',
    subject: 'Email subject',
    text: 'Email text',
    recipients: ['peter@example.com'],
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

  const cb = jest.fn()
  jest.mock('sparkpost')
  const SparkPost = require('sparkpost')
  SparkPost.mockImplementation(() => ({
    transmissions: {
      send: cb,
    },
  }))
  const apply = require('../../rules/apply')
  await apply([rule], event)

  expect(cb).toBeCalledWith({
    content: _.pick(config, 'from', 'subject', 'text'),
    recipients: [{ address: { email: 'peter@example.com' } }],
  })
})

test('multiple emails', async () => {
  const config1 = {
    type: 'email',
    subject: 'Email subject 1',
    text: 'Email text 1',
    recipients: ['peter1@example.com'],
  }

  const config2 = {
    type: 'email',
    subject: 'Email subject 2',
    text: 'Email text 2',
    recipients: ['peter2@example.com'],
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

  const cb = jest.fn()
  jest.mock('sparkpost')
  const SparkPost = require('sparkpost')
  SparkPost.mockImplementation(() => ({
    transmissions: {
      send: cb,
    },
  }))
  const apply = require('../../rules/apply')
  await apply([rule], event)

  expect(cb).toBeCalledWith({
    content: _.pick(config1, 'from', 'subject', 'text'),
    recipients: [{ address: { email: 'peter1@example.com' } }],
  })

  expect(cb).toBeCalledWith({
    content: _.pick(config2, 'from', 'subject', 'text'),
    recipients: [{ address: { email: 'peter2@example.com' } }],
  })
})
