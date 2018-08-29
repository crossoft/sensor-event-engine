const _ = require('lodash')

module.exports = {
  messageType: 'motion',
  measureValues: {
    motion: _.sample([true, false]),
  }
}
