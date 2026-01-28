const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ========================================
// DASHBOARD ROUTE - Web UI
// ========================================
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ========================================
// ROOT ROUTE - API Documentation
// ========================================
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to SaiKet Systems Task 5 - Database Integration API',
    version: '2.0.0',
    author: 'Karthikeya Netha',
    database: 'MySQL/MariaDB',
    endpoints: {
      getAllUsers: 'GET /api/users',
      getUserById: 'GET /api/users/:id',
      createUser: 'POST /api/users',
      updateUser: 'PUT /api/users/:id',
      deleteUser: 'DELETE /api/users/:id',
      getStats: 'GET /api/stats',
      searchUsers: 'GET /api/users/search?query=name',
      dashboard: 'GET /dashboard (Web UI)'
    },
    documentation: 'Visit /dashboard for interactive API testing interface'
  });
});

// ========================================
// CREATE - Add a new user (POST)
// ========================================
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: name, email, age'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (age < 1 || age > 150) {
      return res.status(400).json({
        success: false,
        error: 'Age must be between 1 and 150'
      });
    }

    // Check if email exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, parseInt(age)]
    );

    // Get created user
    const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ========================================
// READ - Get all users (GET)
// ========================================
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    
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

// ========================================
// READ - Get single user by ID (GET)
// ========================================
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
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

// ========================================
// UPDATE - Update user by ID (PUT)
// ========================================
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, age } = req.body;

    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }

    // Validation
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: name, email, age'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (age < 1 || age > 150) {
      return res.status(400).json({
        success: false,
        error: 'Age must be between 1 and 150'
      });
    }

    // Check if email exists (excluding current user)
    const [emailCheck] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );
    if (emailCheck.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Update user
    await db.query(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, parseInt(age), userId]
    );

    // Get updated user
    const [updatedUser] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

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

// ========================================
// DELETE - Delete user by ID (DELETE)
// ========================================
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Get user before deleting
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user[0]
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ========================================
// STATISTICS - Get API stats
// ========================================
app.get('/api/stats', async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as totalUsers,
        ROUND(AVG(age)) as averageAge,
        MAX(age) as oldestUser,
        MIN(age) as youngestUser
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
// SEARCH - Search users by name or email
// ========================================
app.get('/api/users/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const [users] = await db.query(
      'SELECT * FROM users WHERE name LIKE ? OR email LIKE ?',
      [`%${query}%`, `%${query}%`]
    );

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Search error:', error);
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
    error: 'Endpoint not found. Visit / for API documentation'
  });
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🚀 SaiKet Systems - Task 5: Database Integration API    ║
║  📡 Server running on: http://localhost:${PORT}           ║
║  🗄️  Database: MySQL/MariaDB Connected                    ║
║  📚 API Docs: http://localhost:${PORT}/                   ║
║  🎨 Dashboard: http://localhost:${PORT}/dashboard         ║
║  👤 Created by: Karthikeya Netha                          ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
