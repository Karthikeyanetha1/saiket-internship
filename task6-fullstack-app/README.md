# Task 6: Full Stack User Management System

## SaiKet Systems Internship - Full Stack Development

### Project Description
A complete full stack web application with user authentication, role-based access control, and database integration. Features include user registration, login, profile management, and admin dashboard with real-time statistics. Built with JWT authentication and bcrypt password encryption.

### Features Implemented

#### Authentication & Authorization
- ✅ **User Registration** - Create new accounts with validation
- ✅ **User Login** - JWT token-based authentication
- ✅ **Logout** - Secure session termination
- ✅ **Password Encryption** - bcrypt hashing (10 salt rounds)
- ✅ **Role-Based Access** - User and Admin roles
- ✅ **Protected Routes** - Middleware authentication
- ✅ **Token Management** - JWT with 7-day expiration

#### User Features
- ✅ **View Profile** - See account details
- ✅ **Update Profile** - Edit name, email, age, bio
- ✅ **Change Password** - Secure password update with verification
- ✅ **Delete Account** - Permanent account removal with password confirmation
- ✅ **Account Information** - Comprehensive profile display

#### Admin Features
- ✅ **Statistics Dashboard** - Real-time user analytics
  - Total users count
  - Total administrators
  - Active users count
  - Average age calculation
- ✅ **View All Users** - Complete user list with details
- ✅ **View User Details** - Individual user information
- ✅ **Delete Users** - Remove users (except self)
- ✅ **User Management** - Full CRUD operations

#### UI/UX Features
- ✅ **Midnight Blue & Silver Theme** - Premium modern design
- ✅ **Glassmorphism** - Frosted glass effects with backdrop blur
- ✅ **Smooth Animations** - Fade-in, slide, and scale transitions
- ✅ **Responsive Design** - Mobile, tablet, and desktop support
- ✅ **Modal Dialogs** - Change password and delete account modals
- ✅ **Alert System** - Success and error notifications
- ✅ **Loading States** - Spinner animations for async operations

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    age INT,
    bio TEXT,
    avatar_url VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### API Endpoints

#### Base URL: `http://localhost:8080`

#### Public Endpoints
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | Login page | - |
| GET | `/dashboard` | Dashboard page (requires auth) | - |
| GET | `/api` | API documentation | - |
| POST | `/api/auth/register` | Register new user | `{username, email, password, full_name, age?, bio?}` |
| POST | `/api/auth/login` | Login user | `{username, password}` |
| POST | `/api/auth/logout` | Logout user | - |

#### Protected Endpoints (Requires Authentication)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/me` | Get current user profile | User, Admin |
| PUT | `/api/users/me` | Update current user profile | User, Admin |
| PUT | `/api/users/me/password` | Change password | User, Admin |
| DELETE | `/api/users/me` | Delete own account | User, Admin |

#### Admin-Only Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user by ID |
| DELETE | `/api/users/:id` | Delete user by ID |
| GET | `/api/stats` | Get user statistics |

### Authentication Flow
```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Token sent to client
   ↓
5. Client stores token in localStorage
   ↓
6. Client includes token in Authorization header for protected routes
   ↓
7. Server verifies token using middleware
   ↓
8. If valid, proceed to route handler
   ↓
9. If invalid, return 401 Unauthorized
```

### Request/Response Examples

#### Register User
**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "age": 28,
  "bio": "Software Developer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "age": 28,
    "bio": "Software Developer",
    "role": "user",
    "created_at": "2026-01-29T12:00:00.000Z"
  }
}
```

#### Login User
**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@saiket.com",
    "full_name": "System Admin",
    "role": "admin",
    ...
  }
}
```

#### Get Current User Profile (Protected)
**Request:**
```bash
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@saiket.com",
    "full_name": "System Admin",
    "age": 30,
    "bio": "System Administrator",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-01-29T10:00:00.000Z",
    "updated_at": "2026-01-29T12:30:00.000Z"
  }
}
```

#### Get Statistics (Admin Only)
**Request:**
```bash
GET /api/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 4,
    "totalAdmins": 1,
    "activeUsers": 4,
    "averageAge": 34
  }
}
```

### Technologies Used

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL/MariaDB** - Relational database
- **mysql2** - MySQL client with Promise support
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment configuration
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing
- **cookie-parser** - Cookie handling

#### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Styling with animations
- **Vanilla JavaScript** - Client-side logic
- **Fetch API** - HTTP requests
- **LocalStorage** - Token persistence
- **Google Fonts (Inter)** - Typography

### Security Features

- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Tokens** - Secure authentication
- **Token Expiration** - 7-day validity
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CORS Configuration** - Controlled access
- **Role-Based Access Control** - User/Admin separation
- **Password Confirmation** - For sensitive operations
- **Email Validation** - Regex pattern matching
- **Username Validation** - Length and uniqueness checks

### Environment Configuration

Create `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fullstack_users_db
DB_PORT=3306

# Server Configuration
PORT=8080

# JWT Configuration
JWT_SECRET=saiket_systems_secret_key_2026
JWT_EXPIRE=7d
```

### Installation & Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Setup MySQL Database
```bash
# Install MariaDB (Termux)
pkg install mariadb

# Initialize and start
mysql_install_db
mysqld_safe --datadir=$PREFIX/var/lib/mysql &

# Create database
mysql -u root < database.sql
```

#### 3. Setup Initial Users
```bash
node setup-users.js
```

This creates:
- Admin: `admin` / `admin123`
- Users: `johndoe`, `janesmith`, `bobwilson` (all with password `user123`)

#### 4. Start Server
```bash
npm start
```

Server runs on: http://localhost:8080

### Project Structure
```
task6-fullstack-app/
├── server.js              # Main Express server
├── db.js                  # MySQL connection pool
├── middleware.js          # Authentication middleware
├── setup-users.js         # Initial user setup script
├── public/
│   ├── login.html         # Login & registration page
│   └── dashboard.html     # User dashboard
├── .env                   # Environment variables (not in Git)
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
└── README.md             # This file
```

### Middleware

#### verifyToken
Validates JWT token from Authorization header or cookies
```javascript
const { verifyToken } = require('./middleware');
app.get('/api/users/me', verifyToken, handler);
```

#### isAdmin
Checks if authenticated user has admin role
```javascript
const { verifyToken, isAdmin } = require('./middleware');
app.get('/api/users', verifyToken, isAdmin, handler);
```

### Testing

#### With cURL
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get profile (replace TOKEN)
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Demo Credentials

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `admin` | `admin123` | Admin | Full access + statistics + user management |
| `johndoe` | `user123` | User | Profile management only |
| `janesmith` | `user123` | User | Profile management only |
| `bobwilson` | `user123` | User | Profile management only |

### User Interface

#### Login Page
- Tab-based navigation (Login/Register)
- Form validation
- Demo credentials display
- Glassmorphism design
- Responsive layout

#### Dashboard (Regular User)
- Profile management panel
- Account information display
- Update profile form
- Change password modal
- Delete account modal
- Responsive sidebar

#### Dashboard (Admin)
- All regular user features
- Statistics cards (4 metrics)
- All users list view
- User details modal
- Delete user functionality
- Admin badge display

### Skills Demonstrated

#### Full Stack Development
- Frontend and backend integration
- RESTful API design
- Database design and queries
- Authentication and authorization
- State management

#### Backend Development
- Express.js routing
- Middleware implementation
- JWT authentication
- Password encryption
- SQL queries and relationships
- Error handling
- Async/await patterns

#### Frontend Development
- DOM manipulation
- Fetch API usage
- Form validation
- Modal dialogs
- Responsive design
- CSS animations
- LocalStorage usage

#### Database Management
- Schema design
- SQL queries (CRUD)
- Aggregate functions
- Joins and relationships
- Data validation
- Timestamps management

#### Security
- Authentication flows
- Authorization checks
- Password hashing
- Token management
- Input validation
- SQL injection prevention

### Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

### Future Enhancements

Potential features for expansion:
- Email verification
- Password reset functionality
- Profile picture upload
- Two-factor authentication
- Activity logging
- Search and filter users
- Pagination for user list
- Export user data
- Advanced admin controls
- Real-time notifications

### Differences from Previous Tasks

| Feature | Task 4 | Task 5 | Task 6 |
|---------|--------|--------|--------|
| Data Storage | In-Memory | Database | Database |
| Authentication | None | None | JWT + bcrypt |
| User Roles | None | None | User/Admin |
| Frontend | Basic HTML | Dashboard | Full App |
| Security | Basic | Moderate | High |
| Theme | Dark/Neon | Emerald/Gold | Midnight/Silver |

### Created By
Karthikeya Netha  
SaiKet Systems Internship Program  
Task 6 - January 2026

### GitHub Repository
https://github.com/Karthikeyanetha1/saiket-internship

### License
ISC
