const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const db = require('./db');
const { verifyToken, isAdmin } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ========================================
// FRONTEND ROUTES
// ========================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ========================================
// API DOCUMENTATION
// ========================================
app.get('/api', (req, res) => {
  res.json({
    message: '🚀 Welcome to SaiKet Systems Task 6 - Full Stack User Management',
    version: '3.0.0',
    author: 'Karthikeya Netha',
    description: 'Complete Full Stack Application with Authentication',
    endpoints: {
      public: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout'
      },
      protected: {
        getProfile: 'GET /api/users/me',
        updateProfile: 'PUT /api/users/me',
        changePassword: 'PUT /api/users/me/password',
        deleteAccount: 'DELETE /api/users/me',
        getAllUsers: 'GET /api/users (admin only)',
        getUserById: 'GET /api/users/:id (admin only)',
        updateUser: 'PUT /api/users/:id (admin only)',
        deleteUser: 'DELETE /api/users/:id (admin only)',
        stats: 'GET /api/stats (admin only)'
      }
    }
  });
});

// ========================================
// AUTHENTICATION ROUTES
// ========================================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name, age, bio } = req.body;

    // Validation
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, password, and full name are required'
      });
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Username must be between 3 and 50 characters'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, full_name, age, bio) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, age || null, bio || null]
    );

    // Get created user
    const [newUser] = await db.query(
      'SELECT id, username, email, full_name, age, bio, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser[0].id, username: newUser[0].username, role: newUser[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Get user
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    const user = users[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Remove password from response
    delete user.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Logout user
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});
// ========================================
// USER PROFILE ROUTES (Protected)
// ========================================

// Get current user profile
app.get('/api/users/me', verifyToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, full_name, age, bio, avatar_url, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update current user profile
app.put('/api/users/me', verifyToken, async (req, res) => {
  try {
    const { full_name, email, age, bio, avatar_url } = req.body;

    // Validation
    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Full name and email are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if email exists (excluding current user)
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Update user
    await db.query(
      'UPDATE users SET full_name = ?, email = ?, age = ?, bio = ?, avatar_url = ? WHERE id = ?',
      [full_name, email, age || null, bio || null, avatar_url || null, req.user.id]
    );

    // Get updated user
    const [updatedUser] = await db.query(
      'SELECT id, username, email, full_name, age, bio, avatar_url, role, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Change password
app.put('/api/users/me/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters'
      });
    }

    // Get current user
    const [users] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete current user account
app.delete('/api/users/me', verifyToken, async (req, res) => {
  try {
    const { password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required to delete account'
      });
    }

    // Get current user
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, users[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password'
      });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [req.user.id]);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ========================================
// ADMIN ROUTES (Protected - Admin Only)
// ========================================

// Get all users (Admin)
app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, full_name, age, bio, avatar_url, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get user by ID (Admin)
app.get('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const [users] = await db.query(
      'SELECT id, username, email, full_name, age, bio, avatar_url, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update user (Admin)
app.put('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { full_name, email, age, bio, role, is_active } = req.body;

    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validation
    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Full name and email are required'
      });
    }

    // Update user
    await db.query(
      'UPDATE users SET full_name = ?, email = ?, age = ?, bio = ?, role = ?, is_active = ? WHERE id = ?',
      [full_name, email, age || null, bio || null, role || 'user', is_active !== undefined ? is_active : true, userId]
    );

    // Get updated user
    const [updatedUser] = await db.query(
      'SELECT id, username, email, full_name, age, bio, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete user (Admin)
app.delete('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    // Get user
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: users[0]
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get statistics (Admin)
app.get('/api/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as totalAdmins,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as activeUsers,
        ROUND(AVG(age)) as averageAge
      FROM users
    `);

    res.json({
      success: true,
      stats: stats[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ========================================
// 404 Handler
// ========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Visit /api for API documentation'
  });
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🚀 SaiKet Systems - Task 6: Full Stack Application      ║
║  📡 Server running on: http://localhost:${PORT}           ║
║  🗄️  Database: MySQL/MariaDB Connected                    ║
║  🔐 Authentication: JWT Enabled                           ║
║  📚 API Docs: http://localhost:${PORT}/api                ║
║  🎨 Login Page: http://localhost:${PORT}/                 ║
║  👤 Created by: Karthikeya Netha                          ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
