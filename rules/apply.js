const _ = require('lodash')
const sha1 = require('sha1')
const { forEachSeries } = require('p-iteration')
const matchesCondition = require('./matchesCondition')
const {
  Trigger,
} = require('../db')

const defaultTrigger = (rule) => {
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

const handleMatch = async (rule, trigger) => {
  if (await alreadyTriggered(rule)) return

  trigger(rule)

  await createTrigger(rule)
}

const handleNoMatch = (rule) => removeTrigger(rule)

module.exports = (rules, event, trigger = defaultTrigger) => (
  forEachSeries(rules, async (rule) => {
    if (await matchesCondition(rule, event)) {
      await handleMatch(rule, trigger)
    } else {
      await handleNoMatch(rule)
    }
  })
)
