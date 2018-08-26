const all = require('./conditionFunctions')

module.exports = ({ type }) => {
  const result = all[type]
  if (!result) throw `Missing condition type: ${type}`

  return result
}
