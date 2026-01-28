const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupUsers() {
  try {
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fullstack_users_db',
      port: parseInt(process.env.DB_PORT) || 3306
    });

    console.log('✅ Connected to database');

    // Delete existing users
    await connection.query('DELETE FROM users');
    console.log('🗑️  Cleared existing users');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Insert admin
    await connection.query(
      'INSERT INTO users (username, email, password, full_name, age, bio, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['admin', 'admin@saiket.com', adminPassword, 'System Admin', 30, 'System Administrator', 'admin']
    );
    console.log('✅ Created admin user: admin / admin123');

    // Insert sample users
    await connection.query(
      'INSERT INTO users (username, email, password, full_name, age, bio) VALUES (?, ?, ?, ?, ?, ?)',
      ['johndoe', 'john@example.com', userPassword, 'John Doe', 28, 'Software Developer']
    );
    console.log('✅ Created user: johndoe / user123');

    await connection.query(
      'INSERT INTO users (username, email, password, full_name, age, bio) VALUES (?, ?, ?, ?, ?, ?)',
      ['janesmith', 'jane@example.com', userPassword, 'Jane Smith', 32, 'Product Designer']
    );
    console.log('✅ Created user: janesmith / user123');

    await connection.query(
      'INSERT INTO users (username, email, password, full_name, age, bio) VALUES (?, ?, ?, ?, ?, ?)',
      ['bobwilson', 'bob@example.com', userPassword, 'Bob Wilson', 45, 'Marketing Manager']
    );
    console.log('✅ Created user: bobwilson / user123');

    // Verify
    const [users] = await connection.query('SELECT id, username, email, role FROM users');
    console.log('\n📊 Users in database:');
    console.table(users);

    await connection.end();
    console.log('\n✅ Setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupUsers();
