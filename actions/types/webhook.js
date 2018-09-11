const fetch = require('node-fetch')

module.exports = ({
  url,
  method = 'POST',
  headers = { 'Content-Type': 'application/json' },
}, rule, event) => {
  console.log('Executing webhook for rule:', rule)

  fetch(url, {
    method,
    body: JSON.stringify({
      rule,
      event,
    }),
    headers,
  })
}
