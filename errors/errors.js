exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code) {
		res.status(400).send({ msg: 'Bad request' });
	} else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log(err, 'other error take note');
	res.status(500).send({ msg: 'server error, real bad, please send help!!!' });
};
