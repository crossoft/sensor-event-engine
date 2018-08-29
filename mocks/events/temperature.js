const _ = require('lodash')

module.exports = {
  messageType: 'temperature',
  measureValues: {
    temperature: _.random(-40, 50),
  }
}
