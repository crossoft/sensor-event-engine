const _ = require('lodash')
const sha1 = require('sha1')
const { forEachSeries } = require('p-iteration')
const matchesCondition = require('./matchesCondition')
const {
  Trigger,
} = require('../db')
const executeAction = require('../actions/execute')
const defaultActionFn = require('../actions/types/default')

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

const handleTrigger = (rule, event, defaultAction = defaultActionFn) => {
  const configs = rule.actions || []
  if (_.isEmpty(configs)) return defaultAction(rule)

  forEachSeries(configs, (config) => executeAction(config, rule, event))
}

const handleMatch = async (rule, event, defaultAction) => {
  if (await alreadyTriggered(rule)) return

  await createTrigger(rule)
  handleTrigger(rule, event, defaultAction)
}

const handleNoMatch = (rule) => removeTrigger(rule)

module.exports = (rules, event, defaultAction) => (
  forEachSeries(rules, async (rule) => {
    if (await matchesCondition(rule, event)) {
      await handleMatch(rule, event, defaultAction)
    } else {
      await handleNoMatch(rule)
    }
  })
)
