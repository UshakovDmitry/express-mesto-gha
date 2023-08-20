/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

// Создание нового пользователя
module.exports.createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });

    res.status(200).send({
      message: 'Пользователь успешно зарегистрирован.',
      user: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Неверные данные о пользователе или неверная ссылка на аватар.'));
    }
    if (error.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует.'));
    }
    next(error);
  }
};

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );

      // вернём токен
      return res.send({ token });
    })
    .catch(next);
};

// возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      // проверяем, есть ли пользователь с таким id
      if (!user) {
        return next(new NotFoundError('Пользователь не найден.'));
      }

      // возвращаем пользователя, если он есть
      return res.status(200).send(user);
    })
    .catch(next);
};

// Получение пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(201).send(users))
    .catch(next);
};

// Получение пользователя по его id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

// Обновление информации о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверный тип данных.'));
      }
      return next(err);
    });
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверная ссылка'));
      }
      return next(err);
    });
};
