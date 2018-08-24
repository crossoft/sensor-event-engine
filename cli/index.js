const program = require('commander')
const mockEvent = require('../mocks/mockEvent')
const showEvents = require('./showEvents')
const showSensors = require('./showSensors')

program
  .command('mock <eventType>')
  .action(mockEvent)

program
  .command('show <type>')
  .action((type) => {
    if (type === 'events') return showEvents()
    if (type === 'sensors') return showSensors()
  })

program.parse(process.argv)
