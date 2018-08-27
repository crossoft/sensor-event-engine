const {
  Sensor,
  Event,
  Reading,
  Device,
} = require('../db')
const extractReadings = require('./extractReadings')
const checkTriggerRules = require('../rules/checkTrigger')

module.exports = async (req, res) => {
  const {
    sensorId,
    messageType,
    signalStrength,
    dateTimeUtc,
    measureValues,
  } = req.body

  const sensor = await Sensor.findOrCreate({
    where: {
      externalId: sensorId,
    },
  }).spread(async (sensor, created) => {
    if (created) {
      const device = await Device.create()
      await device.setSensors([sensor])
    }

    return sensor
  })

  const event = await Event.create({
    sensorId: sensor.id,
    type: messageType,
    dateTime: dateTimeUtc,
    readings: extractReadings(req.body),
  }, {
    include: [Sensor, Reading],
  })

  checkTriggerRules(event)

  res.json({ success: true })
}
