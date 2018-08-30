const setupDevices = require('./devices')
const setupZones = require('./zones')
const setupSensors = require('./sensors')
const defaultConfig = require('../config')

module.exports = async (config = defaultConfig) => {
  await setupDevices(config)
  await setupZones(config)
  await setupSensors(config)

  console.log('Setup finished.')
}
