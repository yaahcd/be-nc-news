const express = require('express');
const {
	deleteCommentById,
	updatedCommentById,
} = require('../controller/controller');

const commentsRouter = express.Router();

commentsRouter
	.route('/:comment_id')
	.delete(deleteCommentById)
	.patch(updatedCommentById);

module.exports = commentsRouter;
