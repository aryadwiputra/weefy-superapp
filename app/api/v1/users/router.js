//import express
const express = require('express');

//init express router
const router = express.Router();

//import register controller
const userController = require('../users/controller');

//define route for login
router.get('/users', userController.findUsers);

//export router
module.exports = router;
