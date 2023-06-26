const express = require('express');
const { getAllTopics, getAllArticles } = require('./controller/controller');

const app = express();

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticles);

module.exports = app;

