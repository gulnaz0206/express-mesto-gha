const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
    message: 'Некорректное имя',
  },
  about: {
    type: String,
    required: false,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь',
    message: 'Некорректное описание',
  },
  avatar: {
    type: 'String',
    required: false,
    validate: {
      validator: (value) => isURL(value),
      message: (value) => `${(value)} некорректный, попробуйте использовать другой url`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: false,
    unique: true,
    validate: {
      validator: (email) => (isEmail(email)),
      message: ({ value }) => `${console.log(value)} некорректный, попробуйте использовать другой email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { toJSON: { useProtection: true }, toObject: { useProtection: true } });

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      const error = new Unauthorized('Неправильно введены почта или пароль');
      throw error;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      const error = new Unauthorized('Неправильно введены почта или пароль');
      throw error;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = mongoose.model('user', userSchema);
