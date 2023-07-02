const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
      message: 'Некорректное имя',
    },
    about: {
      type: String,
      required: [true, 'Поле "about" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: 'Исследователь',
      message: 'Некорректное описание',
    },
    avatar: {
      data: Buffer,
      type: 'String',
      required: true,
      validate: {
        validator: (value) => isURL(value),
        message: (value) => `${(value)} некорректный, попробуйте использовать другой url`,
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: ({ value }) => `${value} некорректный, попробуйте использовать другой email`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильно введены почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильно введены почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
