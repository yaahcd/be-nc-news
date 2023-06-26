const db = require('../db/connection');

exports.selectAllModels = () => {
  return db.query(`SELECT * FROM topics`)
    .then((topics) => {
      return topics.rows
    })
};

exports.selectAllArticles = () => {
  return db.query(`SELECT * FROM articles`)
  .then((articles) => {
    return articles.rows
  })
};