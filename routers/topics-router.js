const express = require('express');
const { getAllTopics, postNewTopic } = require('../controller/controller');

const topicsRouter = express.Router();

topicsRouter.route('/').get(getAllTopics).post(postNewTopic);

module.exports = topicsRouter;
