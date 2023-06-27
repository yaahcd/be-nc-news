exports.handlePsqlErrors = (err ,req, res, next) => {
  if (err.code){
      res.status(400).send({msg:'Bad request'})
  }
  else next(err)
  }