const errorHandler = (err, req, res) => {
  console.log(err.stack || err);
  const status = err.statusCode || 500;

  res.status(status).send({
    err,
    message: err.message,
  });
};

module.exports = errorHandler;
