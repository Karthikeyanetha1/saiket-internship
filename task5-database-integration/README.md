Task 5: Database Integration with MySQL & Express.js

## SaiKet Systems Internship - Full Stack Development

### Project Description
A complete database integration project connecting a REST API to MySQL/MariaDB. Features CRUD operations, search functionality, real-time statistics, and a premium Emerald & Gold themed dashboard.

### Features Implemented
- ✅ **MySQL Database Integration** - Connected Express.js to MySQL/MariaDB
- ✅ **CRUD Operations** - Create, Read, Update, Delete with SQL queries
- ✅ **Search Functionality** - Search users by name or email using SQL LIKE
- ✅ **Statistics Dashboard** - Real-time aggregate SQL queries (COUNT, AVG, MAX, MIN)
- ✅ **Data Validation** - Email format, age range, duplicate checking
- ✅ **Error Handling** - Proper HTTP status codes and error messages
- ✅ **Timestamps** - Automatic created_at and updated_at tracking
- ✅ **Premium UI** - Emerald Green & Gold luxury themed dashboard
- ✅ **Responsive Design** - Mobile and desktop support
- ✅ **Real-time Updates** - Dashboard syncs with database instantly

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
API Endpoints
Base URL: http://localhost:7000
Method
Endpoint
Description
SQL Query
GET
/
API Documentation
-
GET
/dashboard
Web UI Dashboard
-
POST
/api/users
Create new user
INSERT INTO users
GET
/api/users
Get all users
SELECT * FROM users
GET
/api/users/:id
Get user by ID
SELECT * FROM users WHERE id = ?
PUT
/api/users/:id
Update user
UPDATE users SET ... WHERE id = ?
DELETE
/api/users/:id
Delete user
DELETE FROM users WHERE id = ?
GET
/api/stats
Get statistics
SELECT COUNT(*), AVG(age), MAX(age), MIN(age)
GET
/api/users/search/:query
Search users
SELECT * WHERE name LIKE ? OR email LIKE ?
SQL Queries Used
Create User
INSERT INTO users (name, email, age) VALUES (?, ?, ?);
Read All Users
SELECT * FROM users ORDER BY created_at DESC;
Read Single User
SELECT * FROM users WHERE id = ?;
Update User
UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?;
Delete User
DELETE FROM users WHERE id = ?;
Get Statistics
SELECT 
    COUNT(*) as totalUsers,
    ROUND(AVG(age)) as averageAge,
    MAX(age) as oldestUser,
    MIN(age) as youngestUser
FROM users;
Search Users
SELECT * FROM users WHERE name LIKE ? OR email LIKE ?;
Technologies Used
Backend: Node.js, Express.js
Database: MySQL/MariaDB
Database Driver: mysql2 (with Promise support)
Environment: dotenv for configuration
Frontend: Vanilla JavaScript, HTML5, CSS3
Styling: Custom Emerald & Gold luxury theme
Fonts: Google Fonts (Playfair Display, Poppins)
Skills Demonstrated
SQL Fundamentals
CREATE DATABASE and CREATE TABLE
INSERT, SELECT, UPDATE, DELETE operations
WHERE clauses and filtering
LIKE operator for searching
Aggregate functions (COUNT, AVG, MAX, MIN)
ORDER BY and sorting
AUTO_INCREMENT and PRIMARY KEY
UNIQUE constraints
TIMESTAMP with DEFAULT and ON UPDATE
Database Connection
Connection pooling
Promise-based queries
Error handling for database operations
Connection testing and validation
API Integration
REST API connected to database
SQL injection prevention (parameterized queries)
Database error handling in API responses
Transaction-like operations (check then insert/update)
Express.js
Route handling with database queries
Async/await for database operations
Error middleware
CORS configuration
Body parsing
Environment Configuration
Create .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=saiket_users_db
DB_PORT=3306
PORT=7000
Installation & Setup
1. Install Dependencies
npm install
2. Setup MySQL/MariaDB
# Install MariaDB (Termux)
pkg install mariadb

# Initialize database
mysql_install_db

# Start MySQL server
mysqld_safe --datadir=$PREFIX/var/lib/mysql &
3. Create Database and Table
mysql -u root

# In MySQL prompt:
CREATE DATABASE saiket_users_db;
USE saiket_users_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, age) VALUES
('John Doe', 'john@example.com', 28),
('Jane Smith', 'jane@example.com', 32),
('Bob Johnson', 'bob@example.com', 45),
('Alice Williams', 'alice@example.com', 25);

EXIT;
4. Start Server
npm start
Server runs on: http://localhost:7000
Testing with cURL
# Get all users
curl http://localhost:7000/api/users

# Get single user
curl http://localhost:7000/api/users/1

# Create user
curl -X POST http://localhost:7000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","age":30}'

# Update user
curl -X PUT http://localhost:7000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","email":"updated@example.com","age":35}'

# Delete user
curl -X DELETE http://localhost:7000/api/users/1

# Search users
curl http://localhost:7000/api/users/search/John

# Get statistics
curl http://localhost:7000/api/stats
Project Structure
task5-database-integration/
├── server.js              # Main Express server with database routes
├── db.js                  # MySQL connection pool configuration
├── public/
│   └── dashboard.html     # Emerald & Gold themed UI dashboard
├── .env                   # Environment variables (not in Git)
├── .gitignore            # Git ignore file
├── package.json          # Dependencies and scripts
└── README.md             # This file
Dashboard Features
💎 Emerald Green & Gold Theme - Luxury professional design
📊 Real-time Statistics - Total, Average Age, Oldest, Youngest
🔍 Live Search - Search users as you type
➕ Create Users - Add new users to database
✏️ Edit Users - Update user information inline
🗑️ Delete Users - Remove users with confirmation
⏰ Timestamps - Shows creation time for each user
✨ Smooth Animations - Gradient effects and transitions
📱 Fully Responsive - Works on all screen sizes
Data Validation
Name: Required, VARCHAR(100)
Email: Required, valid format, unique, VARCHAR(100)
Age: Required, integer between 1-150
Error Handling
400 Bad Request - Missing or invalid data
404 Not Found - User not found in database
409 Conflict - Duplicate email address
500 Internal Server Error - Database errors
Security Features
Parameterized SQL queries (prevents SQL injection)
Email validation with regex
Duplicate email checking
Age range validation
Connection pooling for performance
Error message sanitization
Differences from Task 4
Feature
Task 4 (In-Memory)
Task 5 (Database)
Data Storage
JavaScript array
MySQL database
Persistence
Lost on restart
Permanent storage
Search
Array filter
SQL LIKE query
Stats
Array methods
SQL aggregates
Timestamps
Manual
Automatic
Theme
Dark/Neon
Emerald/Gold
Port
5000
7000
Created By
Karthikeya Netha
SaiKet Systems Internship Program
Task 5 - January 2026
GitHub Repository
https://github.com/Karthikeyanetha1/saiket-internship
License
ISC
