const { selectAllModels } = require("../model/model")

exports.getAllTopics = (req, res, next) => {
selectAllModels().then((topics) => {
  res.status(200).send(topics)
})
}