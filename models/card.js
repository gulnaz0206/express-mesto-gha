// /* eslint-disable linebreak-style */
// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable indent */
const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    validate: {
      validator: (value) => validator.isAlpha(value),
      message: 'Неккоректное имя карточки',
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isUrl(value),
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
      minlength: 2,
      maxlength: 30,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('cards', cardSchema);
