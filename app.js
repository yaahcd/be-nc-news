const express = require('express');
const {
	getAllTopics,
	getApi,
	getAllArticles,
	getArticlesById,
	postCommentByArticleId,
  getCommentsByArticleId,
	getAllUsers,
} = require('./controller/controller');
const { handlePsqlErrors, handleServerErrors } = require('./errors/errors');

const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticlesById);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.get('/api/users', getAllUsers);

app.use((err, req, res, next) => {
	if (err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
});

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
