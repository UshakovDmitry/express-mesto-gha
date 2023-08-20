/* eslint-disable no-console */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  const status = err.statusCode || 500;

  let message = 'Произошла ошибка на сервере. Мы уже работаем над ее решением.';
  if (status !== 500) {
    message = err.message;
  }

  res.status(status).send({
    error: 'Ошибка сервера',
    message,
  });

  next();
};

module.exports = errorHandler;
