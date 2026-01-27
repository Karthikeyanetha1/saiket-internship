const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory database (array to store users)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45 }
];

let nextId = 4;

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
    message: '🚀 Welcome to SaiKet Systems Task 4 - User Management REST API',
    version: '1.0.0',
    author: 'Karthikeya Netha',
    endpoints: {
      getAllUsers: 'GET /api/users',
      getUserById: 'GET /api/users/:id',
      createUser: 'POST /api/users',
      updateUser: 'PUT /api/users/:id',
      deleteUser: 'DELETE /api/users/:id',
      getStats: 'GET /api/stats',
      dashboard: 'GET /dashboard (Web UI)'
    },
    documentation: 'Visit /dashboard for interactive API testing interface'
  });
});

// ========================================
// CREATE - Add a new user (POST)
// ========================================
app.post('/api/users', (req, res) => {
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

  // Check if email already exists
  const emailExists = users.find(user => user.email === email);
  if (emailExists) {
    return res.status(409).json({
      success: false,
      error: 'Email already exists'
    });
  }

  // Create new user
  const newUser = {
    id: nextId++,
    name,
    email,
    age: parseInt(age)
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// ========================================
// READ - Get all users (GET)
// ========================================
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// ========================================
// READ - Get single user by ID (GET)
// ========================================
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User with ID ${userId} not found`
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// ========================================
// UPDATE - Update user by ID (PUT)
// ========================================
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, age } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
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

  // Check if email already exists (excluding current user)
  const emailExists = users.find(user => user.email === email && user.id !== userId);
  if (emailExists) {
    return res.status(409).json({
      success: false,
      error: 'Email already exists'
    });
  }

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    age: parseInt(age)
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

// ========================================
// DELETE - Delete user by ID (DELETE)
// ========================================
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `User with ID ${userId} not found`
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

// ========================================
// STATISTICS - Get API stats
// ========================================
app.get('/api/stats', (req, res) => {
  const avgAge = users.reduce((sum, user) => sum + user.age, 0) / users.length || 0;

  res.json({
    success: true,
    stats: {
      totalUsers: users.length,
      averageAge: Math.round(avgAge),
      oldestUser: users.length > 0 ? Math.max(...users.map(u => u.age)) : 0,
      youngestUser: users.length > 0 ? Math.min(...users.map(u => u.age)) : 0
    }
  });
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
╔════════════════════════════════════════════════════════╗
║  🚀 SaiKet Systems - Task 4: REST API Server          ║
║  📡 Server running on: http://localhost:${PORT}        ║
║  📚 API Docs: http://localhost:${PORT}/                ║
║  🎨 Dashboard: http://localhost:${PORT}/dashboard      ║
║  👤 Created by: Karthikeya Netha                       ║
╚════════════════════════════════════════════════════════╝
  `);
});
