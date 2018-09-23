const program = require('commander')
const mockEvent = require('../mocks/mockEvent')
const showEvents = require('./showEvents')
const showSensors = require('./showSensors')
const showDevices = require('./showDevices')
const simulateTemperatureSpikes = require('../simulate/temperatureSpikes')

program
  .command('mock <eventType>')
  .action(mockEvent)

program
  .command('simulate temperature-spikes')
  .option('--function <function>', 'how fast the values should change', 'parabola')
  .option('--min <value>', 'valley value', 25)
  .option('--max <value>', 'peak value', 40)
  .option('--peak <minutes>', 'duration at peaks', 1)
  .option('--valley <minutes>', 'duration at valleys', 1)
  .action(simulateTemperatureSpikes)

program
  .command('show <type>')
  .action((type) => {
    if (type === 'events') return showEvents()
    if (type === 'sensors') return showSensors()
    if (type === 'devices') return showDevices()
  })

program.parse(process.argv)
