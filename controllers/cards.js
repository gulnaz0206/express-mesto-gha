const Card = require('../models/card');
const {
  OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
} = require('../utils/resposneStatus');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
    });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `Ошибка сервера: ${err.message}` });
      } else {
        res.status(SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId, req.user._id).then((card) => {
    if (req.user._id !== card.owner._id) {
      res.status(NOT_FOUND).send({ message: 'Нет прав на удаление' });
    } else {
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          console.log(card);
          if (!card) {
            res.status(NOT_FOUND).send({ message: 'Такой карточуи не существует' });
          } else {
            res.status(OK).send({ data: card });
          }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(BAD_REQUEST).send({ message: 'Невалидный id ' });
          } else {
            res.status(SERVER_ERROR).send({ message: `Произошла ошиибка ${err.name} с текстом ${err.message}` });
          }
        });
    }
  });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
        return;
      }
      res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: `Произошла ошиибка ${err.name} с текстом ${err.message}` });
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
        return;
      }
      res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      } else {
        res.status(SERVER_ERROR).send({ message: `Произошла ошиибка ${err.name} с текстом ${err.message}` });
      }
    });
};
