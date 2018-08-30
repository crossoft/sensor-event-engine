const { forEachSeries } = require('p-iteration')
const {
  Zone,
} = require('../db')

module.exports = ({ zones = [] }) => (
  forEachSeries(zones, (zone) => (
    Zone.findOrCreate({
      where: zone,
    })
  ))
)
