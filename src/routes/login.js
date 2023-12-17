const signinController = require('../app/controller/signinController')
const dataController = require('../app/controller/dataController')
const express = require('express');
const router = express.Router();


router.post('/login', dataController.loginCheck)
router.put('/signin', signinController.signinUser)






module.exports = router