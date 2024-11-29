//import express
const express = require('express');

//init express router
const router = express.Router();

//import register controller
const authController = require('../auth/controller');

//import validate register
const { validateRegister } = require('../../../utils/validators/auth');

//define route for register
router.post('/register', validateRegister, authController.register);

//define route for login
router.post('/login', authController.login);

//export router
module.exports = router;
