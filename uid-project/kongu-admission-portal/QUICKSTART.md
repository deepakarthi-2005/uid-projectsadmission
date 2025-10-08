# Quick Start Guide

## Step-by-Step Instructions to Run the Application

### Step 1: Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should already be running
# Otherwise, start it manually:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# OR
mongod
```

**Alternative: Use MongoDB Atlas (Cloud)**
If you don't have MongoDB installed locally, you can use MongoDB Atlas:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update the `MONGODB_URI` in `backend/.env` with your Atlas connection string

### Step 4: Start the Backend Server

In the backend terminal:

```bash
npm start
```

You should see:
```
Server is running on port 5000
MongoDB Connected Successfully
```

### Step 5: Start the Frontend Server

In the frontend terminal:

```bash
npm start
```

The browser should automatically open at `http://localhost:3000`

### Step 6: Test the Application

1. Fill out the admission form with all required details
2. Select an academic course
3. Click "Submit Application"
4. You should see a success modal with the message "Academic Course Successfully Submitted!"

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the port 27017 is not being used by another application
- Verify the `MONGODB_URI` in `backend/.env`

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change the PORT in `backend/.env`
- The frontend will automatically use a different port if 3000 is occupied

### Dependencies Installation Issues
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

## Testing the API Directly

You can test the backend API using tools like Postman or curl:

```bash
# Test the root endpoint
curl http://localhost:5000/

# Submit an admission (example)
curl -X POST http://localhost:5000/api/admissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Student",
    "email": "test@example.com",
    "phone": "9876543210",
    "dateOfBirth": "2005-01-15",
    "gender": "Male",
    "address": "Test Address",
    "city": "Erode",
    "state": "Tamil Nadu",
    "pincode": "638001",
    "academicCourse": "B.E. Computer Science and Engineering",
    "previousQualification": "12th Standard",
    "percentage": 95,
    "fatherName": "Father Name",
    "motherName": "Mother Name",
    "guardianPhone": "9876543211"
  }'
```

## Next Steps

- Customize the courses list in `frontend/src/components/AdmissionForm.js`
- Add email notifications using nodemailer
- Implement admin dashboard to view all applications
- Add authentication and authorization
- Deploy to production (Heroku, Vercel, Netlify, etc.)

Enjoy your Kongu Engineering College Admission Portal! 🎓
