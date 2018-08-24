const program = require('commander')
const mockEvent = require('../mocks/mockEvent')

program
  .command('mock <eventType>')
  .action((eventType, cmd) => mockEvent(eventType))

program.parse(process.argv)
