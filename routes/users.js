const router = require('express').Router();
const { userValidation, userIdValidation, avatarValidation } = require('../middlewares/validation');
const {
  getUsers,
  updateUser,
  updateAvatar,
  createUser,
  getUserById,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', userIdValidation, getUserById);
router.get('/users', createUser);
router.patch('/users/me', userValidation, updateUser);
router.patch('/users/me/avatar', avatarValidation, updateAvatar);
module.exports = router;
