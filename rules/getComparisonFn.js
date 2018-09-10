const comparisons = require('./comparisons')

module.exports = (comparison) => {
  const result = comparisons[comparison]
  if (!result) throw `Missing condition type: ${comparison}`

  return result
}
