const setupDevices = require('./devices')
const setupZones = require('./zones')
const setupSensors = require('./sensors')
const defaultConfig = require('../config')
const listenToPeriodicalRulesFn = require('../rules/listenPeriodical')

module.exports = async ({ listenToPeriodicalRules = true, config = defaultConfig }) => {
  await setupDevices(config)
  await setupZones(config)
  await setupSensors(config)
  if (listenToPeriodicalRules) listenToPeriodicalRulesFn()
}
