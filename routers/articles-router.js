const express = require('express');
const {
	getArticlesById,
	updateVotesById,
	getCommentsByArticleId,
	postCommentByArticleId,
	getAllArticles,
} = require('../controller/controller');

const articlesRouter = express.Router();

articlesRouter.route('/').get(getAllArticles);

articlesRouter
	.route('/:article_id')
	.get(getArticlesById)
	.patch(updateVotesById);

articlesRouter
	.route('/:article_id/comments')
	.get(getCommentsByArticleId)
	.post(postCommentByArticleId);

module.exports = articlesRouter;
