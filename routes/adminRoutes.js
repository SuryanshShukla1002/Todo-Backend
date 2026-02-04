const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllTodos,
    updateUserRole,
    getDashboardStats
} = require('../controllers/adminController.js');
const { authenticate, authorizeAdmin } = require('../controllers/auth.js');

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorizeAdmin);

// Admin routes
router.get('/users', getAllUsers);
router.get('/todos', getAllTodos);
router.patch('/users/:id/role', updateUserRole);
router.get('/stats', getDashboardStats);

module.exports = router;