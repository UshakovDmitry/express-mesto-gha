const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnathorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => /^(https?:\/\/)(www\.)?([a-zA-Z0-9._]+)\.([a-z]{2,6}\.?)(\/[\w-._/~:@!$&'()*+,;=]*)*\/?#?$/i.test(v),
      message: 'Неправильный формат URL адреса',
    },
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    // пользователь не нашёлся — отклоняем промис
    if (!user) {
      throw new UnathorizedError('Неправильные почта или пароль');
    }

    // нашёлся — сравниваем хеши
    return bcrypt.compare(password, user.password).then((matched) => {
      // хеши не совпали — отклоняем промис
      if (!matched) {
        throw new UnathorizedError('Неправильные почта или пароль');
      }
      // аутентификация успешна
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
