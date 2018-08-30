const { forEachSeries } = require('p-iteration')
const {
  Device,
} = require('../db')

module.exports = async ({ devices = [] }) => (
  await forEachSeries(devices, (device) => (
    Device.findOrCreate({
      where: device,
    })
  ))
)
