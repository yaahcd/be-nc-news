const express = require('express');
const { getAllTopics, postNewTopic, deleteTopic } = require('../controller/controller');

const topicsRouter = express.Router();

topicsRouter.route('/').get(getAllTopics).post(postNewTopic);

topicsRouter.route('/:topic').delete(deleteTopic);

module.exports = topicsRouter;
