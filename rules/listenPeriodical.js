const _ = require('lodash')
const checkPeriodicalRules = require('./checkPeriodical')

module.exports = () => {
  const seconds = 10
  const time = 1000 * seconds
  setInterval(checkPeriodicalRules, time)
  console.log(`Started to check for periodical rules every ${_.round(time / 1000 / 60.0, 1)} minutes.`)
}
