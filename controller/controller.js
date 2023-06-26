const { selectAllModels, selectArticlesById } = require("../model/model")
const jsonEndPoints = require('../endpoints.json');

exports.getApi = (req, res, next) => {
  res.status(200).send(jsonEndPoints)
};

exports.getAllTopics = (req, res, next) => {
selectAllModels()
.then((topics) => {
  res.status(200).send(topics)
})
}

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id  
selectArticlesById(id)
.then((article) => {
  res.status(200).send(article)
})
.catch(next)
}
