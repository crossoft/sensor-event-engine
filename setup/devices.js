const { forEachSeries } = require('p-iteration')
const config = require('../config')
const {
  Device,
} = require('../db')

module.exports = async () => (
  await forEachSeries(config.devices, (device) => (
    Device.findOrCreate({
      where: device,
    })
  ))
)
