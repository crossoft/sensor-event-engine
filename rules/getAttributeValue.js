const attributeCalculators = require('./attributeCalculators')

module.exports = (attribute, event) => {
  const {
    type = 'number',
  } = attribute

  return attributeCalculators[type](attribute, event)
}
