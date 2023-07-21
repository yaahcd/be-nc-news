const express = require('express');
const { getAllUsers, getUserByUsername, postNewUser } = require('../controller/controller');

const usersRouter = express.Router();

usersRouter.route('/').get(getAllUsers);

usersRouter.route('/').post(postNewUser);

usersRouter.route('/:username').get(getUserByUsername);


module.exports = usersRouter;
