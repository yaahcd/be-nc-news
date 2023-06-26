const db = require('../db/connection');

exports.selectAllModels = () => {
  return db.query(`SELECT * FROM topics`)
    .then((topics) => {
      return topics.rows
    })
};

exports.selectAllArticles = () => {
  return db.query(`
  SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, 
  COUNT(c.article_id) AS comment_count 
  FROM articles a 
  JOIN comments c ON a.article_id = c.article_id 
  GROUP BY a.article_id 
  ORDER BY a.created_at DESC;`)
  .then((articles) => {
    return articles.rows
  })
};