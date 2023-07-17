const express = require('express');
const {
	handlePsqlErrors,
	handleServerErrors,
	handleCustomErrors,
	handleNonExistentPaths,
} = require('./errors/errors');
const apiRouter = require('./routers/api-router');

const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.all('*', handleNonExistentPaths);

module.exports = app;
