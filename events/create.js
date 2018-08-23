const {
  Sensor,
  Event,
  Reading,
} = require('../db')
const extractReadings = require('./extractReadings')

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
  }).spread((result) => result)

  await Event.create({
    sensorId: sensor.id,
    type: messageType,
    dateTime: dateTimeUtc,
    readings: extractReadings(req.body),
  }, {
    include: [Sensor, Reading],
  })

  res.json({ success: true })
}
