const _ = require('lodash')
const { forEachSeries } = require('p-iteration')
const {
  db,
  Event,
  Sensor,
  Reading,
  Zone,
} = require('../../db')
const setup = require('../../setup')
const apply = require('../../rules/apply')

beforeEach(async () => {
  await db.sync({ force: true })
})

describe('basic', () => {
  test('should be called', async () => {
    const config = {
      zones: [
        {
          name: 'Living Room'
        }
      ],
      sensors: [
        {
          zone: {
            name: 'Living Room'
          },
          externalId: 'external-1'
        },
      ],
    }

    await setup({ listenToPeriodicalRules: false, config })

    const rule = {
      scope: {
        zone: {
          name: 'Living Room',
        },
      },
      condition: {
        value: {
          name: 'temperature'
        },
        comparison: 'gt',
        threshold: 0
      }
    }

    const sensor = await Sensor.findOne({
      where: {
        externalId: 'external-1',
      },
    })

    const event = await Event.create({
      type: 'temperature',
      sensorId: sensor.id,
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
    const config = {
      zones: [
        {
          name: 'Living Room'
        }
      ],
      sensors: [
        {
          zone: {
            name: 'Living Room'
          },
          externalId: 'external-1'
        },
      ],
    }

    await setup({ listenToPeriodicalRules: false, config })

    const rule = {
      scope: {
        zone: {
          name: 'Living Room',
        },
      },
      condition: {
        value: {
          name: 'temperature'
        },
        comparison: 'gt',
        threshold: 0
      }
    }

    const sensor = await Sensor.create({
      where: {
        externalId: 'external-1000',
      },
    })

    const event = await Event.create({
      type: 'temperature',
      sensorId: sensor.id,
      readings: [{
        name: 'temperature',
        value: 10,
      }],
    }, {
      include: [Sensor, Reading],
    })

    const cb = jest.fn()
    await apply([rule], event, cb)

    expect(cb).not.toBeCalled()
  })
})

describe('count', () => {
  test('should be called', async () => {
    const config = {
      zones: [
        {
          name: 'Living Room'
        }
      ],
      sensors: [
        {
          zone: {
            name: 'Living Room'
          },
          externalId: 'external-1'
        },
      ],
    }

    await setup({ listenToPeriodicalRules: false, config })

    const rule = {
      scope: {
        zone: {
          name: 'Living Room',
        },
      },
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
        comparison: 'gte',
        threshold: 5
      },
    }

    const sensor = await Sensor.findOne({
      where: {
        externalId: 'external-1',
      },
    })

    await forEachSeries(_.times(5), async (n) => {
      await Event.create({
        sensorId: sensor.id,
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
    const config = {
      zones: [
        {
          name: 'Living Room'
        }
      ],
      sensors: [
        {
          zone: {
            name: 'Living Room'
          },
          externalId: 'external-1'
        },
      ],
    }

    await setup({ listenToPeriodicalRules: false, config })

    const rule = {
      scope: {
        zone: {
          name: 'Living Room',
        },
      },
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
        comparison: 'gte',
        threshold: 5
      },
    }

    const sensor = await Sensor.create({
      where: {
        externalId: 'external-1000',
      },
    })

    await forEachSeries(_.times(5), async (n) => {
      await Event.create({
        sensorId: sensor.id,
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
})
