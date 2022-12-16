const express = require('express')
const router = express.Router()
const {login, register, protect} = require('../controller/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect)

module.exports = router