module.exports = express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
const router = require('./routes/router')
const cors = require('cors')
var path = require('path');
const fileUpload =  require('express-fileupload')
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(fileUpload());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


const controller = require('./controller/controller')
controller.search(io)

app.use(router)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

