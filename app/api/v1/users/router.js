//import express
const express = require('express');

//init express router
const router = express.Router();

const { validateUser } = require('../../../utils/validators/user');

//import register controller
const userController = require('../users/controller');

//define route for get all users
router.get('/users', userController.findUsers);

//define route for create user
router.post('/users', validateUser, userController.createUser);

//define route for get user by id
router.get('/users/:id', userController.findUserById);

//export router
module.exports = router;
