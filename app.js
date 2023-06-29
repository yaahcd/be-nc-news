const express = require('express');
const {
	getAllTopics,
	getApi,
	getAllArticles,
	getArticlesById,
	updateVotesById,
	deleteCommentById,
	postCommentByArticleId,
	getCommentsByArticleId,
	getAllUsers,
	updatedCommentById,
} = require('./controller/controller');
const { handlePsqlErrors, handleServerErrors, handleCustomErrors } = require('./errors/errors');
const apiRouter = require('./routers/api-router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
