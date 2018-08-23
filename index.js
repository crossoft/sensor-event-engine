const express = require('express')
const app = express()

app.post('/events', (req, res) =>
  res.json({ success: true })
)

const port = 3000
const opts = {
  port,
  cors: {
    credentials: true,
  },
}

app.listen(port, () => console.log(`Server is running on localhost:${port}`))
