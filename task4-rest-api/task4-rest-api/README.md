# Task 4: REST API with Node.js & Express

## SaiKet Systems Internship - Full Stack Development

### Project Description
A fully functional REST API for User Management with CRUD operations, built using Node.js and Express.js. Features include data validation, error handling, and a premium dark-themed dashboard for testing.

### Features Implemented
- ✅ **CREATE** - Add new users with validation
- ✅ **READ** - Get all users or single user by ID
- ✅ **UPDATE** - Modify existing user data
- ✅ **DELETE** - Remove users from database
- ✅ **Statistics API** - Get user analytics
- ✅ **Premium Dashboard** - Interactive web UI for testing
- ✅ **Data Validation** - Email format, age range, duplicate checks
- ✅ **Error Handling** - Proper HTTP status codes and error messages
- ✅ **JSON Response Format** - Consistent API responses

### API Endpoints

#### Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | API Documentation | None |
| GET | `/dashboard` | Web UI Dashboard | None |
| POST | `/api/users` | Create new user | `{name, email, age}` |
| GET | `/api/users` | Get all users | None |
| GET | `/api/users/:id` | Get user by ID | None |
| PUT | `/api/users/:id` | Update user | `{name, email, age}` |
| DELETE | `/api/users/:id` | Delete user | None |
| GET | `/api/stats` | Get statistics | None |

### Request/Response Examples

#### Create User (POST /api/users)
**Request:**
```json
{
  "name": "Alice Williams",
  "email": "alice@example.com",
  "age": 25
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "name": "Alice Williams",
    "email": "alice@example.com",
    "age": 25
  }
}
```

#### Get All Users (GET /api/users)
**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 28
    },
    ...
  ]
}
```

#### Update User (PUT /api/users/1)
**Request:**
```json
{
  "name": "John Doe Updated",
  "email": "john@example.com",
  "age": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john@example.com",
    "age": 30
  }
}
```

#### Delete User (DELETE /api/users/1)
**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 28
  }
}
```

### Data Validation Rules
- **Name:** Required, string
- **Email:** Required, valid email format, unique
- **Age:** Required, number between 1-150

### Error Handling
- `400 Bad Request` - Missing or invalid data
- `404 Not Found` - User not found
- `409 Conflict` - Duplicate email
- `500 Internal Server Error` - Server errors

### Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Body-Parser** - Request body parsing
- **CORS** - Cross-origin resource sharing
- **Vanilla JavaScript** - Frontend dashboard
- **CSS3** - Dark/neon themed UI

### Skills Demonstrated
- REST API design principles
- HTTP methods and status codes
- Express.js middleware
- Route handling
- Data validation
- Error handling
- JSON handling
- CRUD operations
- In-memory data storage
- API documentation

### How to Run

#### Installation
```bash
npm install
```

#### Start Server
```bash
npm start
```

Server will run on: http://localhost:5000

#### Access Dashboard
Open browser: http://localhost:5000/dashboard

### Testing with Postman
1. Import the API endpoints
2. Set Content-Type: application/json
3. Test all CRUD operations
4. Verify response formats and status codes

### Testing with cURL
```bash
# Get all users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","age":25}'

# Update user
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","email":"updated@example.com","age":30}'

# Delete user
curl -X DELETE http://localhost:5000/api/users/1
```

### Project Structure
```
task4-rest-api/
├── server.js           # Main API server
├── public/
│   └── dashboard.html  # Interactive UI dashboard
├── package.json        # Dependencies
├── .gitignore         # Git ignore file
└── README.md          # Documentation
```

### Dashboard Features
- 📊 Real-time statistics (Total, Average Age, Oldest, Youngest)
- ➕ Create new users with form validation
- ✏️ Edit existing users inline
- 🗑️ Delete users with confirmation
- 🎨 Premium dark/neon gradient theme
- 📱 Fully responsive design
- ⚡ Real-time updates

### Created By
Karthikeya Netha  
SaiKet Systems Internship Program  
Task 4 - January 2026

### GitHub Repository
https://github.com/Karthikeyanetha1/saiket-internship

### License
ISC
