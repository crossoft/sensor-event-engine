const SparkPost = require('sparkpost')
const _ = require('lodash')

module.exports = ({
  sparkPostApiKey,
  from,
  subject,
  text,
  recipients,
}, rule, event) => {
  if (process.env.CONSOLE_LOGGING !== 'false') {
    console.log('Sending email for rule:', rule)
  }

  const client = new SparkPost(sparkPostApiKey)
  const serialize = (emails) => (
    _.map(emails, (email) => ({
      address: {
        email,
      },
    }))
  )

  return client.transmissions.send({
    content: {
      from,
      subject,
      text,
    },
    recipients: serialize(recipients),
  })
}
