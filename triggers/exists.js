const sha1 = require('sha1')
const {
  Trigger,
} = require('../db')

module.exports = (rule) => (
  Trigger.findOne({
    where: {
      rule: sha1(rule)
    }
  })
)
