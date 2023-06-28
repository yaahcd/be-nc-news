const express = require('express');
const { deleteCommentById } = require('../controller/controller');

const commentsRouter = express.Router();

commentsRouter.route('/:comment_id').delete(deleteCommentById);

module.exports = commentsRouter;
