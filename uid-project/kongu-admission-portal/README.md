# Kongu Engineering College - Admission Portal

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing academic course admissions at Kongu Engineering College.

## Features

- ✅ **User Authentication** - Login and Signup with JWT
- ✅ **Secure Password Hashing** - bcrypt encryption
- ✅ **Protected Routes** - Admission form requires authentication
- ✅ Complete admission form with validation
- ✅ Multiple academic courses to choose from
- ✅ Real-time form validation
- ✅ Beautiful and responsive UI
- ✅ Success notification modal
- ✅ MongoDB database integration
- ✅ RESTful API backend
- ✅ Modern React frontend
- ✅ Session management with localStorage

## Tech Stack

### Frontend
- React 18
- React Router DOM v6 (routing)
- Axios for API calls
- Context API (authentication state)
- CSS3 with animations
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- CORS enabled
- RESTful API

## Project Structure

```
kongu-admission-portal/
├── backend/
│   ├── models/
│   │   └── Admission.js
│   ├── routes/
│   │   └── admissionRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdmissionForm.js
│   │   │   ├── AdmissionForm.css
│   │   │   ├── SuccessModal.js
│   │   │   └── SuccessModal.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kongu_admission
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Available Courses

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

## API Endpoints

### POST `/api/admissions/submit`
Submit a new admission application

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "2005-01-15",
  "gender": "Male",
  "address": "123 Main Street",
  "city": "Erode",
  "state": "Tamil Nadu",
  "pincode": "638001",
  "academicCourse": "B.E. Computer Science and Engineering",
  "previousQualification": "12th Standard",
  "percentage": 95.5,
  "fatherName": "Father Name",
  "motherName": "Mother Name",
  "guardianPhone": "9876543211"
}
```

### GET `/api/admissions/all`
Get all admission applications

### GET `/api/admissions/:id`
Get a specific admission application by ID

## Features in Detail

### Admission Form
- Personal information collection
- Address details
- Academic information with course selection
- Parent/Guardian information
- Form validation
- Loading states
- Error handling

### Success Modal
- Animated success notification
- Application details display
- Next steps information
- Application ID generation
- Responsive design

## Database Schema

The Admission model includes:
- Personal details (name, email, phone, DOB, gender)
- Address information (address, city, state, pincode)
- Academic details (course, qualification, percentage)
- Parent/Guardian information
- Application metadata (date, status)
- Timestamps (createdAt, updatedAt)

## Development

To run both frontend and backend concurrently:

1. Open two terminal windows
2. In terminal 1: `cd backend && npm run dev`
3. In terminal 2: `cd frontend && npm start`

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

The optimized production build will be in the `frontend/build` directory.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is created for educational purposes.

## Contact

For any queries regarding admissions, please contact:
- Email: admissions@kongu.edu
- Phone: +91-4294-226000

---

© 2025 Kongu Engineering College. All rights reserved.
