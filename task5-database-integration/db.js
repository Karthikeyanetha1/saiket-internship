const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'saiket_users_db',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Full error:', err);
  } else {
    console.log('✅ Database connected successfully!');
    
    // Test query
    connection.query('SELECT COUNT(*) as count FROM users', (err, results) => {
      if (err) {
        console.error('❌ Error querying database:', err);
      } else {
        console.log('📊 Users in database:', results[0].count);
      }
    });
    
    connection.release();
  }
});

module.exports = promisePool;
