const _ = require('lodash')
const {
  Device,
} = require('../db')
const toTable = require('./toTable')

module.exports = async () => {
  const devices = await Device.findAll()
  const head = _.keys(devices[0].dataValues)

  console.log(toTable(head, _.map(devices, 'dataValues')))
}
