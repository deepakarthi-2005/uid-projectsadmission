# ⚠️ IMPORTANT: Complete Setup Instructions

## 🔴 CRITICAL STEP - Update .env File

Before running the application with authentication, you **MUST** update your `.env` file:

### Location
```
backend/.env
```

### Add These Lines
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kongu_admission
JWT_SECRET=kongu_secret_key_2025_change_this_in_production
JWT_EXPIRE=7d
```

### Why This Is Important
- JWT_SECRET is required for token generation and verification
- Without it, login/signup will not work properly
- The application uses this secret to encrypt user tokens

## 🚀 Restart Servers

After updating the .env file, restart both servers:

### Backend
```bash
# Stop current server (Ctrl+C in terminal)
cd backend
npm start
```

### Frontend
```bash
# Stop current server (Ctrl+C in terminal)
cd frontend
npm start
```

## ✅ Verify Setup

1. Backend should show: "Server is running on port 5000"
2. Backend should show: "MongoDB Connected Successfully"
3. Frontend should open at: http://localhost:3000
4. You should see the **Login page** (not the admission form)

## 🎯 First Time Usage

1. **Open** http://localhost:3000
2. **Click** "Sign up here" link
3. **Create** a new account
4. **Automatically redirected** to admission form
5. **Fill and submit** the admission form

## 📝 Quick Test

Try creating a test account:
- Full Name: Test Student
- Email: test@kongu.edu
- Phone: 9876543210
- Password: test123
- Confirm Password: test123

Then login with:
- Email: test@kongu.edu
- Password: test123

---

**Don't forget to update the .env file!** This is the most important step.
