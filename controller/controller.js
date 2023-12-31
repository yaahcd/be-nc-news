const {
  selectAllTopics,
  selectAllArticles,
  selectArticlesById,
  checkIdExists,
  selectAllUsers,
  updatedVotesOfSelectedId,
  checkCommentIdExists,
  deleteSelectedComment,
  addCommentByArticleId,
  selectCommentsByArticleId,
  postNewArticle,
  updateSelectedComment,
  selectUserByUsername,
  postTopic,
  deleteSelectedArticle,
  postUser,
  deleteSelectedTopic,
} = require("../model/model");
const jsonEndPoints = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  res.status(200).send(jsonEndPoints);
};

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;

  selectAllArticles(topic, sort_by, order, limit, p)
    .then((articles) => {
      res.status(200).send({ total_count: articles.length, articles });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const body = req.body;

  postNewArticle(body)
    .then((article) => {
      res.status(201).send({ article_posted: article });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticlesById(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.updateVotesById = (req, res, next) => {
  const id = req.params.article_id;
  const inputVotes = req.body.inc_votes;

  const promises = [
    checkIdExists(id),
    updatedVotesOfSelectedId(id, inputVotes),
  ];

  Promise.all(promises)
    .then((completedPromises) => {
      const updatedArticle = completedPromises[1];
      res.status(201).send(updatedArticle);
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  const body = req.body;

  const promises = [checkIdExists(id), addCommentByArticleId(id, body)];

  Promise.all(promises)
    .then((completedPromises) => {
      const newComment = completedPromises[1];
      res.status(201).send(newComment);
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  const { p, limit } = req.query;

  const promises = [checkIdExists(id), selectCommentsByArticleId(id, p, limit)];

  Promise.all(promises)
    .then((completedPromises) => {
      const commentList = completedPromises[1];
      res.status(200).send({ commentList });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.updatedCommentById = (req, res, next) => {
  const id = req.params.comment_id;
  const inputVotes = req.body.inc_votes;

  const promises = [
    checkCommentIdExists(id),
    updateSelectedComment(id, inputVotes),
  ];

  Promise.all(promises)
    .then((completedPromises) => {
      const updatedComment = completedPromises[1];
      res.status(201).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;

  const promises = [checkCommentIdExists(id), deleteSelectedComment(id)];

  Promise.all(promises)
    .then((completedPromises) => {
      const emptyObj = completedPromises;
      res.status(204).send();
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username;

  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  const body = req.body;

  postTopic(body)
    .then((postedTopic) => {
      res.status(201).send({ postedTopic });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const id = req.params.article_id;

  const promises = [checkIdExists(id), deleteSelectedArticle(id)];

  Promise.all(promises)
    .then((completedPromises) => {
      res.status(204).send();
    })
    .catch(next);
};

exports.postNewUser = (req, res, next) => {
  const body = req.body;

  postUser(body)
    .then((postedUser) => {
      res.status(201).send({ postedUser });
    })
    .catch(next);
};

exports.deleteTopic = (req, res, next) => {
  const topic = req.params.topic;

  deleteSelectedTopic(topic)
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
};
