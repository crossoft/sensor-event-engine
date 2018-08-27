const calculators = require('./attribute/calculators')

module.exports = (rule, event) => {
  const {
    condition: {
      attribute: {
        calculate = 'number',
      },
    },
  } = rule

  return calculators[calculate](rule, event)
}
