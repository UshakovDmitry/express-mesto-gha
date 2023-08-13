const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;

const errorsHandler = (err, res) => {
  if (err.name === 'CastError') {
    return res
      .status(ERROR_BAD_REQUEST)
      .send({ message: `Ошибка ${ERROR_BAD_REQUEST}.` });
  }
  if (err.name === 'ValidationError') {
    return res
      .status(ERROR_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные' });
  }

  return res
    .status(ERROR_INTERNAL_SERVER)
    .send({ message: `Ошибка сервера: ${ERROR_INTERNAL_SERVER}` });
};

module.exports = {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  errorsHandler,
};
