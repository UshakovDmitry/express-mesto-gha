const Card = require('../models/card');
const {
  errorsHandler, ERROR_NOT_FOUND,
} = require('../utils/utils');

// Получение карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => errorsHandler(err, res));
};
// Создание новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => errorsHandler(err, res));
};
// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => errorsHandler(err, res));
};
// Поставить лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => errorsHandler(err, res));
};
// Удалить лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => errorsHandler(err, res));
};