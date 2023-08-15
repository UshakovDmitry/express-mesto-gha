const router = require('express').Router();

const {
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/joi-validations');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCardValidation, createCard);

router.delete('/cards/:cardId', cardIdValidation, deleteCard);

router.put('/cards/:cardId/likes', cardIdValidation, likeCard);

router.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
