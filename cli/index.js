const program = require('commander')
const mockEvent = require('../mocks/mockEvent')
const showEvents = require('./showEvents')
const showSensors = require('./showSensors')
const showDevices = require('./showDevices')

program
  .command('mock <eventType>')
  .action(mockEvent)

program
  .command('show <type>')
  .action((type) => {
    if (type === 'events') return showEvents()
    if (type === 'sensors') return showSensors()
    if (type === 'devices') return showDevices()
  })

program.parse(process.argv)
