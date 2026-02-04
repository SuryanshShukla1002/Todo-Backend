const express = require('express');
const router = express.Router();
const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');
const { todoValidation, todoUpdateValidation } = require('../controllers/validation');
const { authenticate } = require('../controllers/auth.js');

// All routes require authentication
router.use(authenticate);

// Todo routes
router.route('/') 
    .get(getTodos)
    .post(todoValidation, createTodo);

router.route('/:id')
    .get(getTodo)
    .put(todoUpdateValidation, updateTodo)
    .delete(deleteTodo);

module.exports = router;