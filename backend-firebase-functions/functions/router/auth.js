var express = require('express')
var router = express.Router()

const { forgotPass, login, register, resetPass, changePass, deleteAccount, updateEmail } = require('../controller/auth')

router.post('/login', login)
router.post('/register', register)
router.post('/reset-email', updateEmail)
router.post('/forgotPass', forgotPass)
router.post('/resetPass', resetPass)
router.post('/changePass', changePass)
router.post('/deleteAccount', deleteAccount)

module.exports = router