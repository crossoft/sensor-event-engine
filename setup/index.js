const setupDevices = require('./devices')
const setupZones = require('./zones')
const listenToPeriodicalRules = require('../rules/listenPeriodical')

module.exports = async () => {
  await setupDevices()
  await setupZones()
  await listenToPeriodicalRules()

  console.log('Setup finished.')
}
