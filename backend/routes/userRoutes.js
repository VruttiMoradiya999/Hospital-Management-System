const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  deleteUser,
  updateUserProfile 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Personal profile route (Available to all logged in users)
router.route('/profile').put(updateUserProfile);

// Admin only routes
router.use(authorize('Admin'));
router.route('/').get(getUsers);
router.route('/:id').get(getUserById).delete(deleteUser);

module.exports = router;
