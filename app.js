const express = require('express');
const { getAllTopics, getApi } = require('./controller/controller');

const app = express();

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

module.exports = app;

