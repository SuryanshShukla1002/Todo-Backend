const Todo = require('../models/Todo.js');

// Get todos based on user role
const getTodos = async (req, res) => {
    try {
        const { category, completed, search } = req.query;
        let query = {};

        // If user role, only show their todos. If admin, show all todos
        if (req.userRole !== 'admin') {
            query.user = req.userId;
        }

        // Apply filters
        if (category) {
            query.category = category;
        }
 
        if (completed !== undefined) {
            query.completed = completed === 'true';
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const todos = await Todo.find(query)
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: todos.length,
            todos
        });
    } catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching todos',
            error: error.message
        });
    }
};

// Get single todo
const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id).populate('user', 'username email');

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        // Check if user can access this todo
        if (req.userRole !== 'admin' && todo.user._id.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only view your own todos.'
            });
        }

        res.status(200).json({
            success: true,
            todo
        });
    } catch (error) {
        console.error('Get todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching todo',
            error: error.message
        });
    }
};

// Create new todo
const createTodo = async (req, res) => {
    try {
        const { title, description, dueDate, category } = req.body;

        const todo = new Todo({
            title,
            description,
            dueDate,
            category,
            user: req.userId
        });

        await todo.save();

        const populatedTodo = await Todo.findById(todo._id).populate('user', 'username email');

        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            todo: populatedTodo
        });
    } catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating todo',
            error: error.message
        });
    }
};

// Update todo
const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        // Check if user can update this todo
        if (req.userRole !== 'admin' && todo.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update your own todos.'
            });
        }

        // Update fields
        const { title, description, dueDate, category, completed } = req.body;

        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (dueDate !== undefined) todo.dueDate = dueDate;
        if (category !== undefined) todo.category = category;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();

        const updatedTodo = await Todo.findById(todo._id).populate('user', 'username email');

        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            todo: updatedTodo
        });
    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating todo',
            error: error.message
        });
    }
};

// Delete todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        // Check if user can delete this todo
        if (req.userRole !== 'admin' && todo.user.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own todos.'
            });
        }

        await Todo.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting todo',
            error: error.message
        });
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
};