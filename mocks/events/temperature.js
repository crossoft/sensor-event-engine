const _ = require('lodash')

module.exports = {
  messageType: 'temperature',
  measureValues: {
    value: _.random(-40, 50),
  }
}
