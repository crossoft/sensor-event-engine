const _ = require('lodash')

module.exports = (steps, { signalStrengthFollows, eventType }) => {
  console.log('> Simulation plan:')

  _.each(steps, ({ value, duration }) => {
    const signalStrengthPart = signalStrengthFollows ? ` "signalStrength": ${_.round(value, 1)};` : ''
    console.log(`| "${eventType}" event: ${_.round(value, 1)};${signalStrengthPart} Wait ${_.round(duration, 1)}mins`)
  })
}
