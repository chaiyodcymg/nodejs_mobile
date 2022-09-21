const express = require('../index')
const router = express.Router()
const controller = require('../controller/controller')
// const app = express()
// const {server }= require('../index')

router.use((req, res, next) => {
     next() 
  })

router.get('/',controller.home )
router.post('/login',controller.login)
router.post('/register',controller.register)
router.post('/updateprofilewithImage',controller.updateprofile_withImage)
router.post('/updateprofilenoImage',controller.updateprofile_noImage)
router.post('/profile',controller.profile)

module.exports = router