const express = require('express');
const { getAllTopics } = require('../controller/controller');

const topicsRouter = express.Router();

topicsRouter.route('/').get(getAllTopics);

module.exports = topicsRouter;
