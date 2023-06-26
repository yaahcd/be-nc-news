const express = require('express');
const { getAllTopics, getApi, getAllArticles } = require('./controller/controller');

const app = express();

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticles);

module.exports = app;

