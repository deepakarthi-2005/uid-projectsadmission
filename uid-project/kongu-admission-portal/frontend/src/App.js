import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import AdmissionForm from './components/AdmissionForm';
import SuccessModal from './components/SuccessModal';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AdminApplications from './pages/AdminApplications';
import AdminDashboard from './pages/AdminDashboard';

function AdmissionPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmissionSuccess = (data) => {
    setSubmittedData(data);
    setShowSuccess(true);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    setSubmittedData(null);
  };

  return (
    <div className="App">
      <Navbar />
      
      <header className="app-header">
        <div className="header-content">
          <h1>Kongu Engineering College</h1>
          <p className="subtitle">Admission Portal - Academic Year 2025-26</p>
        </div>
      </header>
      
      <main className="main-content">
        <AdmissionForm onSuccess={handleSubmissionSuccess} />
      </main>

      {showSuccess && (
        <SuccessModal 
          data={submittedData} 
          onClose={handleCloseModal} 
        />
      )}

      <footer className="app-footer">
        <p>&copy; 2025 Kongu Engineering College. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/admission" 
          element={
            <ProtectedRoute>
              <AdmissionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/applications" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="main-content">
                  <AdminApplications />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="main-content">
                  <AdminDashboard />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
