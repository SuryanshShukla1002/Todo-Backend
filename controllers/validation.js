const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Registration validation rules
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    validate
];

// Login validation rules
const loginValidation = [
    body('identifier')
        .trim()
        .notEmpty()
        .withMessage('Email or username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];

// Todo validation rules
const todoValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('category')
        .isIn(['Urgent', 'Non-Urgent'])
        .withMessage('Category must be either Urgent or Non-Urgent'),
    validate
];

// Todo update validation rules
const todoUpdateValidation = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('category')
        .optional()
        .isIn(['Urgent', 'Non-Urgent'])
        .withMessage('Category must be either Urgent or Non-Urgent'),
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean'),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    todoValidation,
    todoUpdateValidation
};