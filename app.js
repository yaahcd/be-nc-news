const express = require('express');
const { getAllTopics, getArticlesById, getApi } = require('./controller/controller');
const { handlePsqlErrors } = require('./errors/errors')

const app = express();

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.use((err, req, res, next) => {
  if(err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
});

app.use((err, req, res, next) => {
  handlePsqlErrors(err, req, res, next)
});

module.exports = app;

