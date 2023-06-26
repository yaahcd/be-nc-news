const db = require('../db/connection');

exports.selectAllModels = () => {
  return db.query(`SELECT * FROM topics`)
    .then((topics) => {
      return topics.rows
    })
}

exports.selectArticlesById = (id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then((article) => {
    if(article.rows.length === 0){
      return Promise.reject({status: 404, msg: 'Invalid ID'})
    }
    return article.rows
  })
}