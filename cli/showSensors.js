const _ = require('lodash')
const Table = require('cli-table2')
const {
  Sensor,
} = require('../db')

module.exports = async () => {
  const sensors = await Sensor.findAll()
  const head = _.keys(sensors[0].dataValues)

  const table = new Table({ head })
  _.each(sensors, sensor => {
    table.push(_.values(_.map(sensor.dataValues, _.toString)))
  })

  console.log(table.toString())
}
