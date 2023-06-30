const express = require('express');
const {
	handlePsqlErrors,
	handleServerErrors,
	handleCustomErrors,
} = require('./errors/errors');
const apiRouter = require('./routers/api-router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

app.all('*', (_, res) => {
	res.status(404).send({ status: 404, msg: 'Not found' });
});

module.exports = app;
