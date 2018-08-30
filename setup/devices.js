const { forEachSeries } = require('p-iteration')
const {
  Device,
} = require('../db')

module.exports = ({ devices = [] }) => (
  forEachSeries(devices, (device) => (
    Device.findOrCreate({
      where: device,
    })
  ))
)
