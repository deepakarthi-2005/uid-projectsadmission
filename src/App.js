import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdmissionRegistration from './pages/forms/AdmissionRegistration';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AdmissionRegistration />} />
          <Route path="/registration" element={<AdmissionRegistration />} />
          <Route path="/admissions" element={<AdmissionRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
