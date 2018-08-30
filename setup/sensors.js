const { forEachSeries } = require('p-iteration')
const _ = require('lodash')
const {
  Sensor,
  Device,
  Zone,
} = require('../db')

const deviceWhere = async ({ device }) => {
  if (!device) return {}

  const {
    id,
  } = await Device.findOne({ where: device })

  return { deviceId: id }
}

const zoneWhere = async ({ zone }) => {
  if (!zone) return {}

  const {
    id,
  } = await Zone.findOne({ where: zone })

  return { zoneId: id }
}

module.exports = async ({ sensors = [] }) => (
  await forEachSeries(sensors, async (sensor) => {
    await Sensor.findOrCreate({
      where: {
        ..._.omit(sensor, ['device', 'zone']),
        ...await deviceWhere(sensor),
        ...await zoneWhere(sensor),
      },
    })
  })
)
