const triggerExists = require('../triggers/exists')
const createTrigger = require('../triggers/create')
const handleActions = require('../actions/handle')

module.exports = async (rule, event, defaultAction) => {
  if (await triggerExists(rule)) return

  await createTrigger(rule)
  handleActions(rule, event, defaultAction)
}
