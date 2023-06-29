const express = require('express');
const { getApi } = require('../controller/controller');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');
const topicsRouter = require('./topics-router');

const apiRouter = express.Router();

apiRouter.route('/').get(getApi);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
