const _ = require('lodash')
const {
  Sensor,
} = require('../db')
const toTable = require('./toTable')

module.exports = async () => {
  const sensors = await Sensor.findAll()
  const head = _.keys(sensors[0].dataValues)

  console.log(toTable(head, _.map(sensors, 'dataValues')))
}
