const express = require('express');
const {
	getArticlesById,
	updateVotesById,
	getCommentsByArticleId,
	postCommentByArticleId,
	getAllArticles,
	postArticle,
	deleteArticleById,
} = require('../controller/controller');

const articlesRouter = express.Router();

articlesRouter.route('/').get(getAllArticles).post(postArticle);

articlesRouter
	.route('/:article_id')
	.get(getArticlesById)
	.patch(updateVotesById)
	.delete(deleteArticleById);

articlesRouter
	.route('/:article_id/comments')
	.get(getCommentsByArticleId)
	.post(postCommentByArticleId);

module.exports = articlesRouter;
