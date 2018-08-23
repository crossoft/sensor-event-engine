const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

const port = 3000
const opts = {
  port,
  cors: {
    credentials: true,
  },
}

app.listen(port, () => console.log(`Server is running on localhost:${port}`))
