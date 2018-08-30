const { forEachSeries } = require('p-iteration')
const {
  Zone,
} = require('../db')

module.exports = async ({ zones = [] }) => (
  await forEachSeries(zones, (zone) => (
    Zone.findOrCreate({
      where: zone,
    })
  ))
)
