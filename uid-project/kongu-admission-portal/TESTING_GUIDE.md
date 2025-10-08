# Testing Guide - Kongu Engineering College Admission Portal

## ✅ Application Status

### Backend Server
- **Running on**: http://localhost:5000
- **Database**: MongoDB Connected
- **API Endpoint**: http://localhost:5000/api/admissions

### Frontend Server
- **Running on**: http://localhost:3000
- **Status**: Compiled Successfully

## 🧪 How to Test the Application

### 1. Open the Application
Visit: http://localhost:3000

You should see:
- Header: "Kongu Engineering College"
- Subtitle: "Admission Portal - Academic Year 2025-26"
- A beautiful admission form with gradient background

### 2. Fill Out the Form

#### Personal Information
- **Full Name**: Enter your full name (e.g., "Karthik Kumar")
- **Email**: Enter valid email (e.g., "karthik@example.com")
- **Phone**: 10-digit number (e.g., "9876543210")
- **Date of Birth**: Select date
- **Gender**: Select from dropdown (Male/Female/Other)

#### Address Information
- **Address**: Complete address
- **City**: e.g., "Erode"
- **State**: e.g., "Tamil Nadu"
- **Pincode**: 6-digit code (e.g., "638001")

#### Academic Information
- **Select Academic Course**: Choose from dropdown:
  - B.E. Computer Science and Engineering
  - B.E. Electronics and Communication Engineering
  - B.E. Mechanical Engineering
  - B.E. Civil Engineering
  - B.E. Electrical and Electronics Engineering
  - B.Tech. Information Technology
  - B.Tech. Artificial Intelligence and Data Science
  - M.E. Computer Science and Engineering
  - M.E. Applied Electronics
  - MBA - Master of Business Administration
- **Previous Qualification**: e.g., "12th Standard"
- **Percentage/CGPA**: Enter marks (e.g., "95.5")

#### Parent/Guardian Information
- **Father's Name**: Enter father's name
- **Mother's Name**: Enter mother's name
- **Guardian Phone**: 10-digit number

### 3. Submit the Application

Click the **"Submit Application"** button

### 4. Expected Success Response

You should see a beautiful animated modal with:

✅ **Success Icon**: Animated checkmark in a purple circle
✅ **Title**: "Application Submitted Successfully! 🎉"
✅ **Message**: "Your academic course admission application has been successfully submitted to Kongu Engineering College."

#### What's Next Section:
- ✓ You will receive a confirmation email shortly
- ✓ Our admission team will review your application
- ✓ You will be notified about the status within 3-5 working days
- ✓ Keep checking your email for updates

#### Application Details:
- Name: [Your entered name]
- Course: [Selected course]
- Email: [Your email]
- Application ID: [Unique MongoDB ID]

### 5. Close the Modal

Click the **"Close"** button to return to the form (which will be reset)

## 🔍 Verify Data in MongoDB

### Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to database: `kongu_admission`
4. Open collection: `admissions`
5. You should see your submitted application

### Using MongoDB Shell
```bash
mongosh
use kongu_admission
db.admissions.find().pretty()
```

## 🧪 Test API Endpoints Directly

### Test Backend API
Open a new terminal and run:

```bash
# Test root endpoint
curl http://localhost:5000/

# Get all admissions
curl http://localhost:5000/api/admissions/all

# Submit test application
curl -X POST http://localhost:5000/api/admissions/submit -H "Content-Type: application/json" -d "{\"fullName\":\"Test User\",\"email\":\"test@test.com\",\"phone\":\"9876543210\",\"dateOfBirth\":\"2005-01-15\",\"gender\":\"Male\",\"address\":\"Test Address\",\"city\":\"Erode\",\"state\":\"Tamil Nadu\",\"pincode\":\"638001\",\"academicCourse\":\"B.E. Computer Science and Engineering\",\"previousQualification\":\"12th\",\"percentage\":95,\"fatherName\":\"Father\",\"motherName\":\"Mother\",\"guardianPhone\":\"9876543211\"}"
```

## 🎨 UI Features to Notice

### Animations
- Form fields highlight on focus (purple border)
- Submit button has hover effect (lifts up)
- Loading spinner appears during submission
- Success modal slides up with fade-in effect
- Checkmark animates in the success modal

### Responsive Design
- Try resizing the browser window
- Form adapts to mobile, tablet, and desktop screens
- Modal is centered and scrollable on small screens

### Validation
- All fields are required (marked with *)
- Email must be valid format
- Phone numbers must be 10 digits
- Pincode must be 6 digits
- Percentage must be between 0-100

## 🐛 Troubleshooting

### Form doesn't submit
- Check browser console (F12) for errors
- Verify backend is running on port 5000
- Check MongoDB connection

### Success modal doesn't appear
- Check browser console for errors
- Verify API response in Network tab (F12)

### Data not saved in MongoDB
- Ensure MongoDB is running
- Check backend terminal for errors
- Verify connection string in `.env`

## 📊 Expected Behavior

### Success Case
1. Fill form → Click Submit
2. Button shows "Submitting..." with spinner
3. Success modal appears with animation
4. Application details displayed
5. Data saved in MongoDB
6. Form resets after closing modal

### Error Case
1. Fill form with invalid data
2. Browser validation prevents submission
3. OR backend returns error
4. Error message appears in red box above form

## 🎯 Test Scenarios

### Scenario 1: Complete Application
- Fill all fields correctly
- Submit successfully
- Verify success modal
- Check MongoDB for data

### Scenario 2: Invalid Email
- Enter invalid email format
- Try to submit
- Browser shows validation error

### Scenario 3: Invalid Phone
- Enter less than 10 digits
- Try to submit
- Browser shows validation error

### Scenario 4: Multiple Submissions
- Submit first application
- Close modal
- Fill and submit second application
- Both should be saved in database

## 🎓 Success Criteria

✅ Form loads with all fields
✅ All validations work
✅ Submit button shows loading state
✅ Success modal appears with animation
✅ Application details are correct
✅ Data is saved in MongoDB
✅ Form resets after submission
✅ Multiple submissions work
✅ Responsive on all screen sizes

---

**Congratulations!** Your Kongu Engineering College Admission Portal is working perfectly! 🎉

If you encounter any issues, check the backend and frontend terminals for error messages.
