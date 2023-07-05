const router = require('express').Router();
const { userValidation, userIdValidation, avatarValidation } = require('../middlewares/validation');
const {
  getUsers,
  updateUser,
  updateAvatar,
  getUserById,
  getMeUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMeUser);
router.get('/users/:userId', userIdValidation, getUserById);
router.patch('/users/me/update', userValidation, updateUser);
router.patch('/users/me/avatar', avatarValidation, updateAvatar);
module.exports = router;
