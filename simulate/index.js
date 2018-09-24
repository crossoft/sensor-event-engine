const getSteps = require('./getSteps')
const printSimulationPlan = require('./printSimulationPlan')
const executeSimulationPlan = require('./executeSimulationPlan')

module.exports = async (opts) => {
  const steps = getSteps(opts)
  printSimulationPlan(steps, opts)
  console.log('> Executing simulation...')
  return executeSimulationPlan(steps, opts)
  console.log('> Simulation finished successfully.')
}
