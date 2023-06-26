const { selectAllModels, selectAllArticles } = require("../model/model")

exports.getAllTopics = (req, res, next) => {
selectAllModels().then((topics) => {
  res.status(200).send(topics)
})
};

exports.getAllArticles = (req, res, next) => {
selectAllArticles().then((articles) => {
  res.status(200).send(articles)
})
};