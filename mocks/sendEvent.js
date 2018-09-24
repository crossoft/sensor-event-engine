const fetch = require('node-fetch')

module.exports = async (eventData) => {
  const resp = await fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  })

  console.log('Event sent:', eventData)
}
