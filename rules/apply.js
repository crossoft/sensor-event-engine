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

const act = (config, rule, event) => actions[config.type](config, rule, event)

const handleTrigger = (rule, event, defaultTrigger) => {
  const configs = rule.actions || []
  if (_.isEmpty(configs)) return defaultTrigger(rule)

  forEachSeries(configs, (config) => act(config, rule, event))
}

const handleMatch = async (rule, event, defaultTrigger) => {
  if (await alreadyTriggered(rule)) return

  await createTrigger(rule)
  handleTrigger(rule, event, defaultTrigger)
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
