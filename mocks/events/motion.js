const _ = require('lodash')

module.exports = {
  messageType: 'motion',
  measureValues: {
    value: _.sample([true, false]),
  }
}
