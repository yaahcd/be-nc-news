const express = require('express');
const { getAllTopics, getArticlesById } = require('./controller/controller');

const app = express();

app.get('/api/topics', getAllTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.use((err, req, res, next) => {
  if(err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
});

module.exports = app;

