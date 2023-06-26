const { selectAllModels } = require("../model/model");
const jsonEndPoints = require('../endpoints.json');

exports.getApi = (req, res, next) => {
  res.status(200).send(jsonEndPoints)
};

exports.getAllTopics = (req, res, next) => {
selectAllModels().then((topics) => {
  res.status(200).send(topics)
})
};