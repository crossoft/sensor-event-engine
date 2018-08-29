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

describe('basic', () => {
  test('should be called', async () => {
    const rule = {
      scope: {
        event: {
          type: 'temperature',
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
      scope: {
        event: {
          type: 'temperature',
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

    const event = await Event.create({
      type: 'battery',
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
    const rule = {
      scope: {
        event: {
          type: 'battery',
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

    await forEachSeries(_.times(5), async (n) => {
      await Event.create({
        type: 'battery',
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
      scope: {
        event: {
          type: 'temperature',
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

    await forEachSeries(_.times(5), async (n) => {
      await Event.create({
        type: 'battery',
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

  describe('sensorId', () => {
    test('should be called', async () => {
      const sensor = await Sensor.create()

      const rule = {
        scope: {
          event: {
            type: 'battery',
          },
          sensor: {
            id: sensor.id,
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

      await forEachSeries(_.times(5), async (n) => {
        await Event.create({
          sensorId: sensor.id,
          type: 'battery',
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
      const sensor = await Sensor.create()
      const rule = {
        scope: {
          event: {
            type: 'temperature',
          },
          sensor: {
            id: sensor.id + 1000,
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

      await forEachSeries(_.times(5), async (n) => {
        await Event.create({
          type: 'temperature',
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
})
