const db = require('../db/connection');

exports.selectAllModels = () => {
	return db.query(`SELECT * FROM topics`).then((topics) => {
		return topics.rows;
	});
};

exports.selectAllArticles = (topic, sort_by = 'created_at', order = 'DESC') => {
	const validSortBy = [
		'article_id',
		'title',
		'topic',
		'author',
		'created_at',
		'votes',
		'article_img_url',
	];

	if (!validSortBy.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'Bad request' });
	}

	let query = `SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, 
  COUNT(c.article_id) AS comment_count 
  FROM articles a 
  JOIN comments c ON a.article_id = c.article_id `;

	let queryValues = [];
	if (topic) {
		const validTopics = ['cats', 'mitch', 'paper'];

		if (!validTopics.includes(topic)) {
			return Promise.reject({ status: 404, msg: 'Topic not found' });
		}

		query += `WHERE a.topic = $1 `;
		queryValues.push(topic);
	}

	query += `GROUP BY a.article_id ORDER BY ${sort_by} `;

	if (order) {
		const validOrder = ['asc', 'ASC', 'desc', 'DESC'];

		if (!validOrder.includes(order)) {
			return Promise.reject({ status: 400, msg: 'Bad request' });
		}

		query += `${order};`;
	}

	return db.query(query, queryValues).then((articles) => {
		return articles.rows;
	});
};

exports.selectArticlesById = (id) => {
	return db
		.query(
			`SELECT a.article_id, a.title, a.topic, a.author, a.body, a.created_at, a.votes, a.article_img_url, 
		COUNT(c.article_id) AS comment_count 
		FROM articles a 
		JOIN comments c ON a.article_id = c.article_id 
		WHERE a.article_id = $1
		GROUP BY a.article_id;`,
			[id]
		)
		.then((article) => {
			if (article.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Invalid ID' });
			}
			return article.rows;
		});
};

exports.updatedVotesOfSelectedId = (id, inputVotes) => {
	return db
		.query(`SELECT votes FROM articles WHERE article_id = $1;`, [id])
		.then(({ rows }) => {
			const newVotes = rows[0].votes + inputVotes;
			return db
				.query(
					`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`,
					[newVotes, id]
				)
				.then((updatedArticle) => {
					return updatedArticle.rows;
				});
		});
};

exports.addCommentByArticleId = (id, body) => {
	return db
		.query(
			`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING*;`,
			[body.username, body.body, id]
		)
		.then((newComment) => {
			return newComment.rows;
		});
};

exports.selectCommentsByArticleId = (id) => {
	return db
		.query(
			`
  SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
			[id]
		)
		.then((comments) => {
			return comments.rows;
		});
};

exports.checkIdExists = (id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Invalid ID' });
			}
		});
};

exports.selectAllUsers = () => {
	return db.query(`SELECT * FROM users`).then((users) => {
		return users.rows;
	});
};

exports.deleteSelectedComment = (id) => {
	return db
		.query(`DELETE FROM comments WHERE comment_id = $1`, [id])
		.then((result) => {
			return result;
		});
};

exports.checkCommentIdExists = (id) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Invalid ID' });
			}
		});
};
