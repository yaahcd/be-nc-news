const {
	selectAllModels,
	selectAllArticles,
	selectArticlesById,
	addCommentByArticleId,
	checkIdExists,
} = require('../model/model');
const jsonEndPoints = require('../endpoints.json');

exports.getApi = (req, res, next) => {
	res.status(200).send(jsonEndPoints);
};

exports.getAllTopics = (req, res, next) => {
	selectAllModels().then((topics) => {
		res.status(200).send(topics);
	});
};

exports.getAllArticles = (req, res, next) => {
	selectAllArticles().then((articles) => {
		res.status(200).send(articles);
	});
};

exports.getArticlesById = (req, res, next) => {
	const id = req.params.article_id;
	selectArticlesById(id)
		.then((article) => {
			res.status(200).send(article);
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
