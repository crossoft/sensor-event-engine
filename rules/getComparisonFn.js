const comparisons = require('./comparisons')

module.exports = ({
  condition: {
    comparison,
  },
}) => {
  const result = comparisons[comparison]
  if (!result) throw `Missing condition type: ${comparison}`

  return result
}
