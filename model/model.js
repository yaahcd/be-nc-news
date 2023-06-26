const db = require('../db/connection');

exports.selectAllModels = () => {
  return db.query(`SELECT * FROM topics`)
    .then((topics) => {
      return topics.rows
    })
}

console.log(this.selectAllModels)