const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (value) => isURL(value),
        message: 'Неккоректная ссылка',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: 'user',
      }],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false },
);
module.exports = mongoose.model('card', cardSchema);
