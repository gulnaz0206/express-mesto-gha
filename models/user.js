const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
    message: 'Некорректное имя',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь',
    message: 'Некорректное описание',
  },
  avatar: {
    type: 'String',
    validate: {
      validator: (value) => isURL(value),
      message: 'URL некорректный, попробуйте использовать другой url',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Email некорректный, попробуйте использовать другой email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { toJSON: { useProtection: true }, toObject: { useProtection: true }, versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw Unauthorized('Неправильно введены почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw Unauthorized('Неправильно введены почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
