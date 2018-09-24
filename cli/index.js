const program = require('commander')
const mockEvent = require('../mocks/mockEvent')
const showEvents = require('./showEvents')
const showSensors = require('./showSensors')
const showDevices = require('./showDevices')
const simulateTemperatureSpike = require('../simulate/temperatureSpike')

program
  .command('mock <eventType>')
  .action(mockEvent)

program
  .command('simulate-temperature-spike')
  .option('--change-function <function>', 'value change function', 'parabola')
  .option('--normal-value <value>', 'normal value', 25)
  .option('--normal-duration <minutes>', 'duration before the peak', 1)
  .option('--peak-value <value>', 'peak value', 40)
  .option('--peak-duration <minutes>', 'duration in peak', 1)
  .action(simulateTemperatureSpike)

program
  .command('simulate-temperature-crater')
  .option('--change-function <function>', 'value change function', 'parabola')
  .option('--normal-value <value>', 'normal value', 25)
  .option('--normal-duration <minutes>', 'duration before the peak', 1)
  .option('--peak-value <value>', 'peak value', -10)
  .option('--peak-duration <minutes>', 'duration in peak', 1)
  .action(simulateTemperatureSpike)

program
  .command('show <type>')
  .action((type) => {
    if (type === 'events') return showEvents()
    if (type === 'sensors') return showSensors()
    if (type === 'devices') return showDevices()
  })

program.parse(process.argv)
