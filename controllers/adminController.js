const User = require('../models/User');
const Todo = require('../models/Todo');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Get all todos (admin only)
const getAllTodos = async (req, res) => {
    try {
        const { category, completed, search } = req.query;
        let query = {};

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
            .populate('user', 'username email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: todos.length,
            todos
        });
    } catch (error) {
        console.error('Get all todos error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching todos',
            error: error.message
        });
    }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be either "user" or "admin"'
            });
        }

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from changing their own role
        if (user._id.toString() === req.userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot change your own role'
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            user
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: error.message
        });
    }
};

// Get dashboard stats (admin only)
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTodos = await Todo.countDocuments();
        const completedTodos = await Todo.countDocuments({ completed: true });
        const urgentTodos = await Todo.countDocuments({ category: 'Urgent' });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalTodos,
                completedTodos,
                pendingTodos: totalTodos - completedTodos,
                urgentTodos
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getAllTodos,
    updateUserRole,
    getDashboardStats
};