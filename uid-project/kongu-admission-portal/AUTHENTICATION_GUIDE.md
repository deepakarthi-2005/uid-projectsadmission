# Authentication Guide - Login & Signup

## 🔐 Authentication System Overview

Your Kongu Engineering College Admission Portal now includes a complete authentication system with:

- **User Registration (Signup)**
- **User Login**
- **Protected Routes**
- **JWT Token Authentication**
- **Secure Password Hashing (bcrypt)**
- **Session Management**

## 📋 New Features Added

### Backend (Node.js + Express)
1. **User Model** (`models/User.js`)
   - Full name, email, password, phone
   - Password hashing with bcrypt
   - Role-based access (student/admin)

2. **Authentication Routes** (`routes/authRoutes.js`)
   - POST `/api/auth/signup` - Register new user
   - POST `/api/auth/login` - Login user
   - GET `/api/auth/me` - Get current user

3. **JWT Token Generation**
   - Secure token creation
   - 7-day expiration
   - Token verification

### Frontend (React)
1. **Login Page** (`components/Login.js`)
   - Email and password fields
   - Form validation
   - Error handling
   - Redirect to admission form after login

2. **Signup Page** (`components/Signup.js`)
   - Full name, email, phone, password fields
   - Password confirmation
   - Form validation
   - Automatic login after signup

3. **Authentication Context** (`context/AuthContext.js`)
   - Global auth state management
   - Login/logout functions
   - User data persistence

4. **Protected Routes** (`components/ProtectedRoute.js`)
   - Prevents unauthorized access
   - Redirects to login if not authenticated

5. **Navbar** (`components/Navbar.js`)
   - Shows logged-in user name
   - Logout button
   - Branding

## 🚀 How to Use

### Step 1: Update Environment Variables

**IMPORTANT**: Add JWT_SECRET to your `.env` file in the backend folder:

```bash
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kongu_admission
JWT_SECRET=kongu_secret_key_2025_change_this_in_production
JWT_EXPIRE=7d
```

### Step 2: Restart the Backend Server

Stop the current backend server (Ctrl+C) and restart it:

```bash
cd backend
npm start
```

### Step 3: Restart the Frontend Server

Stop the current frontend server (Ctrl+C) and restart it:

```bash
cd frontend
npm start
```

## 📱 User Flow

### New User Registration

1. Open http://localhost:3000
2. You'll be redirected to the **Login page**
3. Click **"Sign up here"** link
4. Fill out the signup form:
   - Full Name
   - Email Address
   - Phone Number (10 digits)
   - Password (minimum 6 characters)
   - Confirm Password
5. Click **"Sign Up"**
6. Automatically logged in and redirected to admission form

### Existing User Login

1. Open http://localhost:3000
2. Enter your **email** and **password**
3. Click **"Login"**
4. Redirected to admission form

### Filling Admission Form

1. After login, you'll see:
   - **Navbar** with your name and logout button
   - **Admission form** with all fields
2. Fill out the admission form
3. Submit application
4. See success modal

### Logout

1. Click the **"Logout"** button in the navbar
2. Redirected to login page
3. Session cleared

## 🔒 Security Features

### Password Security
- Passwords are hashed using bcrypt (10 salt rounds)
- Never stored in plain text
- Minimum 6 characters required

### JWT Tokens
- Secure token generation
- Stored in localStorage
- Sent with API requests
- 7-day expiration

### Protected Routes
- Admission form only accessible when logged in
- Automatic redirect to login if not authenticated
- Token verification on protected endpoints

### Input Validation
- Email format validation
- Phone number format (10 digits)
- Password length validation
- Password confirmation matching

## 🎨 UI/UX Features

### Login Page
- Clean, modern design
- Purple gradient background
- KEC logo circle
- Email and password fields
- Loading state during login
- Error messages
- Link to signup page

### Signup Page
- Same beautiful design
- Full name, email, phone fields
- Password and confirm password
- Password strength indicator (min 6 chars)
- Loading state during signup
- Error messages
- Link to login page

### Navbar
- Sticky navigation bar
- KEC branding
- User name display with icon
- Logout button with hover effect
- Responsive design

## 🧪 Testing the Authentication

### Test Signup Flow

1. Go to http://localhost:3000
2. Click "Sign up here"
3. Enter test data:
   ```
   Full Name: Test Student
   Email: test@kongu.edu
   Phone: 9876543210
   Password: test123
   Confirm Password: test123
   ```
4. Click "Sign Up"
5. Should redirect to admission form
6. Check navbar - should show "Test Student"

### Test Login Flow

1. Logout (click logout button)
2. Should redirect to login page
3. Enter credentials:
   ```
   Email: test@kongu.edu
   Password: test123
   ```
4. Click "Login"
5. Should redirect to admission form

### Test Protected Route

1. Logout
2. Try to manually go to http://localhost:3000/admission
3. Should automatically redirect to login page

### Test Session Persistence

1. Login
2. Refresh the page
3. Should remain logged in
4. User data persists

## 📊 Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (default: 'student'),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Admissions Collection
(Existing - unchanged)

## 🔍 API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "student"
  }
}
```

#### POST /api/auth/login
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "student"
  }
}
```

#### GET /api/auth/me
Get current user (requires token)

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "student"
  }
}
```

## 🐛 Troubleshooting

### "User already exists" error
- Email is already registered
- Try logging in instead
- Or use a different email

### "Invalid email or password" error
- Check email spelling
- Check password (case-sensitive)
- Ensure you've registered first

### Token expired
- Login again
- Token expires after 7 days

### Can't access admission form
- Make sure you're logged in
- Check if token is in localStorage (F12 → Application → Local Storage)

### Backend not connecting
- Ensure MongoDB is running
- Check backend server is running on port 5000
- Verify .env file has correct settings

## 🎯 Routes Overview

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirects to `/login` |
| `/login` | Public | Login page |
| `/signup` | Public | Signup page |
| `/admission` | Protected | Admission form (requires login) |

## 💡 Next Steps & Enhancements

Possible future improvements:

1. **Email Verification**
   - Send verification email on signup
   - Verify email before allowing login

2. **Password Reset**
   - Forgot password functionality
   - Email reset link

3. **Admin Dashboard**
   - View all applications
   - Approve/reject applications
   - User management

4. **Profile Page**
   - Edit user information
   - Change password
   - View application history

5. **Remember Me**
   - Extended session option
   - Persistent login

6. **Social Login**
   - Google OAuth
   - Facebook login

---

**Your authentication system is now complete and ready to use!** 🎉

Users must sign up and login before they can access the admission form.
