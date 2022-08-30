const express = require('../index')
const router = express.Router()
const controller = require('../controller/controller')

router.use((req, res, next) => {
     next() 
  })

router.get('/',controller.home )
router.post('/login',controller.login)
router.post('/register',controller.register)
module.exports = router