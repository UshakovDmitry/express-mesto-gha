const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorConflict = require('../errors/ErrorConflict');

const { ERROR_NOT_FOUND, errorsHandler } = require('../utils/utils');

// Создание нового пользователя
module.exports.createUser = (req, res, next) => {
  User.findOne(req.body.email).then((user) => {
    if (user) {
      throw new ErrorConflict(`Пользователь с ${req.body.email} уже существует`);
    }

    return bcrypt.hash(req.body.password, 10);
  })
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch(next);
};

// Аутентификация пользователя
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаст токен
      const token = jwt.sign(
        { _id: user._id },
        {
          expiresIn: '7d',
        },
      );

      // вернёт токен
      res.send({ token });
    })
    .catch((err) => {
      // возвращает ошибку аутентификации
      res.status(401).send({ message: err.message });
    });
};

// возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    // проверяем, есть ли пользователь с таким id
    if (!user) {
      return Promise.reject(new Error('Пользователь не найден.'));
    }

    // возвращает пользователя, если он есть
    return res.status(200).send(user);
  }).catch((err) => {
    next(err);
  });
};

// Полученет пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => errorsHandler(err, res));
};

// Получение пользователя по его id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => errorsHandler(err, res));
};

// Обновление информации о пользователе
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => errorsHandler(err, res));
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => errorsHandler(err, res));
};
