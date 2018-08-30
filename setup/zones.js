const { forEachSeries } = require('p-iteration')
const config = require('../config')
const {
  Zone,
} = require('../db')

module.exports = async () => (
  await forEachSeries(config.zones, (zone) => (
    Zone.findOrCreate({
      where: zone,
    })
  ))
)
