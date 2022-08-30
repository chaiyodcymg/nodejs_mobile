module.exports = express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
const router = require('./routes/router')
const cors = require('cors')
app.use(cors({origin:"http://localhost:8080"}))

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(router)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})