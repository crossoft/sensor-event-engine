const _ = require('lodash')
const sha1 = require('sha1')
const { forEachSeries } = require('p-iteration')
const matchesCondition = require('./matchesCondition')
const {
  Trigger,
} = require('../db')
const actions = require('../actions')

const defaultTriggerFn = (rule) => {
  console.log('Rule triggered:', rule)
}

const alreadyTriggered = (rule) => (
  Trigger.findOne({
    where: {
      rule: sha1(rule)
    }
  })
)

const createTrigger = (rule) => (
  Trigger.create({
    rule: sha1(rule)
  })
)

const removeTrigger = (rule) => (
  Trigger.destroy({
    where: {
      rule: sha1(rule)
    }
  })
)

const triggerFromRule = (rule, event) => {
  const action = actions[_.get(rule, 'action.type')]
  if (!action) return null

  return action(rule, event)
}

const handleTrigger = (rule, event, defaultTrigger) => {
  const trigger = triggerFromRule(rule)
  if (!trigger) return defaultTrigger(rule)

  return trigger(rule, event)
}

const handleMatch = async (rule, event, defaultTrigger) => {
  if (await alreadyTriggered(rule)) return

  handleTrigger(rule, event, defaultTrigger)
  await createTrigger(rule)
}

const handleNoMatch = (rule) => removeTrigger(rule)

module.exports = (rules, event, defaultTrigger = defaultTriggerFn) => (
  forEachSeries(rules, async (rule) => {
    if (await matchesCondition(rule, event)) {
      await handleMatch(rule, event, defaultTrigger)
    } else {
      await handleNoMatch(rule)
    }
  })
)
