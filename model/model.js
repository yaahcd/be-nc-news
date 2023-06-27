const db = require('../db/connection');

exports.selectAllModels = () => {
	return db.query(`SELECT * FROM topics`).then((topics) => {
		return topics.rows;
	});
};

exports.selectAllArticles = () => {
	return db
		.query(
			`
  SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, 
  COUNT(c.article_id) AS comment_count 
  FROM articles a 
  JOIN comments c ON a.article_id = c.article_id 
  GROUP BY a.article_id 
  ORDER BY a.created_at DESC;`
		)
		.then((articles) => {
			return articles.rows;
		});
};

exports.selectArticlesById = (id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
		.then((article) => {
			if (article.rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Invalid ID' });
			}
			return article.rows;
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
