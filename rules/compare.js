const getComparisonFn = require('./getComparisonFn')

module.exports = (attributeValue, comparison, threshold) => {
  const comparisonFn = getComparisonFn(comparison)
  return comparisonFn(attributeValue, threshold)
}
