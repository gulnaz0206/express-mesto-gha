const router = require('express').Router();
const {
  getUsers,
  updateUser,
  updateAvatar,
  createUser,
  getUserById,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
module.exports = router;
