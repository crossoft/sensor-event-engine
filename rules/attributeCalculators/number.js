const _ = require('lodash')

module.exports = ({ name }, event) => _.find(event.readings, { name }).value
