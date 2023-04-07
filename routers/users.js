
const router = require('express').Router();

const {getUsers, getUserById} = require('../controllers/users');


router.get('/users', getUsers);
router.get('/users/:userId', getUserById);


module.exports = router;