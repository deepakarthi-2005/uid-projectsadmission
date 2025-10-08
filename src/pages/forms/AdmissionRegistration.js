import React, { useState } from 'react';
import FormRow from '../../components/FormRow';
import Breadcrumbs from '../../components/Breadcrumbs';
import './AdmissionRegistration.css';

export default function AdmissionRegistration() {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    
    // Academic Information
    qualification: '',
    institution: '',
    percentage: '',
    yearOfPassing: '',
    
    // UID Project Specific
    projectCategory: 'Product Design',
    experienceLevel: 'Beginner',
    portfolioUrl: '',
    designSoftware: [],
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    
    // Additional Information
    previousDesignExperience: '',
    motivation: '',
    specialRequirements: '',
    
    // Agreements
    termsAccepted: false,
    dataConsent: false,
    newsletter: true
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Admissions', to: '/admissions' },
    { label: 'Registration' }
  ];

  const designSoftwareOptions = [
    'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 
    'Sketch', 'AutoCAD', 'SolidWorks', 'Blender', '3ds Max', 'Rhino'
  ];

  const setField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSoftwareChange = (software) => {
    setFormData(prev => ({
      ...prev,
      designSoftware: prev.designSoftware.includes(software)
        ? prev.designSoftware.filter(s => s !== software)
        : [...prev.designSoftware, software]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    if (!formData.dataConsent) newErrors.dataConsent = 'Data consent is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      alert('Registration submitted successfully! You will receive a confirmation email shortly.');
      // Navigate to next step or confirmation page
    } catch (error) {
      alert('Error submitting registration: ' + error.message);
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear all form data?')) {
      setFormData({
        fullName: '', email: '', phone: '', dateOfBirth: '', gender: 'Prefer not to say',
        address: '', city: '', state: '', pincode: '', country: 'India',
        qualification: '', institution: '', percentage: '', yearOfPassing: '',
        projectCategory: 'Product Design', experienceLevel: 'Beginner', portfolioUrl: '',
        designSoftware: [], emergencyName: '', emergencyPhone: '', emergencyRelation: '',
        previousDesignExperience: '', motivation: '', specialRequirements: '',
        termsAccepted: false, dataConsent: false, newsletter: true
      });
      setErrors({});
    }
  };

  return (
    <div className="admission-registration">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="registration-card">
        <div className="card-header">
          <h1>UID Projects Admission Registration</h1>
          <p>Join our community of innovative designers and creators</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Personal Information Section */}
          <section className="form-section">
            <h2>Personal Information</h2>
            
            <FormRow label="Full Name" required error={errors.fullName}>
              <input 
                type="text"
                value={formData.fullName} 
                onChange={e => setField('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </FormRow>

            <div className="grid-2">
              <FormRow label="Email Address" required error={errors.email}>
                <input 
                  type="email"
                  value={formData.email} 
                  onChange={e => setField('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </FormRow>

              <FormRow label="Phone Number" required error={errors.phone}>
                <input 
                  type="tel"
                  value={formData.phone} 
                  onChange={e => setField('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </FormRow>
            </div>

            <div className="grid-3">
              <FormRow label="Date of Birth">
                <input 
                  type="date"
                  value={formData.dateOfBirth} 
                  onChange={e => setField('dateOfBirth', e.target.value)}
                />
              </FormRow>

              <FormRow label="Gender">
                <select value={formData.gender} onChange={e => setField('gender', e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </FormRow>
            </div>
          </section>

          {/* Address Information Section */}
          <section className="form-section">
            <h2>Address Information</h2>
            
            <FormRow label="Address">
              <input 
                type="text"
                value={formData.address} 
                onChange={e => setField('address', e.target.value)}
                placeholder="Street address, apartment, suite, etc."
              />
            </FormRow>

            <div className="grid-3">
              <FormRow label="City">
                <input 
                  type="text"
                  value={formData.city} 
                  onChange={e => setField('city', e.target.value)}
                  placeholder="City"
                />
              </FormRow>

              <FormRow label="State">
                <input 
                  type="text"
                  value={formData.state} 
                  onChange={e => setField('state', e.target.value)}
                  placeholder="State"
                />
              </FormRow>

              <FormRow label="PIN Code">
                <input 
                  type="text"
                  value={formData.pincode} 
                  onChange={e => setField('pincode', e.target.value)}
                  placeholder="PIN Code"
                />
              </FormRow>
            </div>
          </section>

          {/* Academic Information Section */}
          <section className="form-section">
            <h2>Academic Information</h2>
            
            <div className="grid-2">
              <FormRow label="Highest Qualification" required error={errors.qualification}>
                <select value={formData.qualification} onChange={e => setField('qualification', e.target.value)}>
                  <option value="">Select qualification</option>
                  <option>12th Grade</option>
                  <option>Diploma</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>Other</option>
                </select>
              </FormRow>

              <FormRow label="Institution Name">
                <input 
                  type="text"
                  value={formData.institution} 
                  onChange={e => setField('institution', e.target.value)}
                  placeholder="Name of your institution"
                />
              </FormRow>
            </div>

            <div className="grid-2">
              <FormRow label="Percentage/CGPA">
                <input 
                  type="text"
                  value={formData.percentage} 
                  onChange={e => setField('percentage', e.target.value)}
                  placeholder="e.g., 85% or 8.5 CGPA"
                />
              </FormRow>

              <FormRow label="Year of Passing">
                <input 
                  type="number"
                  value={formData.yearOfPassing} 
                  onChange={e => setField('yearOfPassing', e.target.value)}
                  placeholder="2024"
                  min="1990"
                  max="2030"
                />
              </FormRow>
            </div>
          </section>

          {/* UID Project Specific Section */}
          <section className="form-section">
            <h2>Design & Project Information</h2>
            
            <div className="grid-2">
              <FormRow label="Project Category">
                <select value={formData.projectCategory} onChange={e => setField('projectCategory', e.target.value)}>
                  <option>Product Design</option>
                  <option>UI/UX Design</option>
                  <option>Industrial Design</option>
                  <option>Fashion Design</option>
                  <option>Interior Design</option>
                  <option>Graphic Design</option>
                  <option>Animation & VFX</option>
                </select>
              </FormRow>

              <FormRow label="Experience Level">
                <select value={formData.experienceLevel} onChange={e => setField('experienceLevel', e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Professional</option>
                </select>
              </FormRow>
            </div>

            <FormRow label="Portfolio URL" hint="Share your online portfolio, Behance, or Dribbble profile">
              <input 
                type="url"
                value={formData.portfolioUrl} 
                onChange={e => setField('portfolioUrl', e.target.value)}
                placeholder="https://yourportfolio.com"
              />
            </FormRow>

            <FormRow label="Design Software Experience" hint="Select all that apply">
              <div className="checkbox-grid">
                {designSoftwareOptions.map(software => (
                  <label key={software} className="checkbox-item">
                    <input 
                      type="checkbox"
                      checked={formData.designSoftware.includes(software)}
                      onChange={() => handleSoftwareChange(software)}
                    />
                    <span>{software}</span>
                  </label>
                ))}
              </div>
            </FormRow>
          </section>

          {/* Emergency Contact Section */}
          <section className="form-section">
            <h2>Emergency Contact</h2>
            
            <div className="grid-3">
              <FormRow label="Contact Name">
                <input 
                  type="text"
                  value={formData.emergencyName} 
                  onChange={e => setField('emergencyName', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </FormRow>

              <FormRow label="Contact Phone">
                <input 
                  type="tel"
                  value={formData.emergencyPhone} 
                  onChange={e => setField('emergencyPhone', e.target.value)}
                  placeholder="Emergency contact phone"
                />
              </FormRow>

              <FormRow label="Relationship">
                <select value={formData.emergencyRelation} onChange={e => setField('emergencyRelation', e.target.value)}>
                  <option value="">Select relationship</option>
                  <option>Parent</option>
                  <option>Guardian</option>
                  <option>Sibling</option>
                  <option>Spouse</option>
                  <option>Friend</option>
                  <option>Other</option>
                </select>
              </FormRow>
            </div>
          </section>

          {/* Additional Information Section */}
          <section className="form-section">
            <h2>Additional Information</h2>
            
            <FormRow label="Previous Design Experience" hint="Briefly describe any previous design work or projects">
              <textarea 
                value={formData.previousDesignExperience} 
                onChange={e => setField('previousDesignExperience', e.target.value)}
                rows={3}
                placeholder="Describe your design background..."
              />
            </FormRow>

            <FormRow label="Motivation" hint="Why do you want to join UID Projects?">
              <textarea 
                value={formData.motivation} 
                onChange={e => setField('motivation', e.target.value)}
                rows={3}
                placeholder="Share your motivation and goals..."
              />
            </FormRow>

            <FormRow label="Special Requirements" hint="Any accessibility needs or special accommodations">
              <textarea 
                value={formData.specialRequirements} 
                onChange={e => setField('specialRequirements', e.target.value)}
                rows={2}
                placeholder="Any special requirements..."
              />
            </FormRow>
          </section>

          {/* Agreements Section */}
          <section className="form-section">
            <h2>Terms & Agreements</h2>
            
            <div className="checkbox-section">
              <label className={`checkbox-item required ${errors.termsAccepted ? 'error' : ''}`}>
                <input 
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={e => setField('termsAccepted', e.target.checked)}
                />
                <span>I accept the <a href="/terms" target="_blank">Terms and Conditions</a> *</span>
              </label>

              <label className={`checkbox-item required ${errors.dataConsent ? 'error' : ''}`}>
                <input 
                  type="checkbox"
                  checked={formData.dataConsent}
                  onChange={e => setField('dataConsent', e.target.checked)}
                />
                <span>I consent to the processing of my personal data *</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={e => setField('newsletter', e.target.checked)}
                />
                <span>Subscribe to newsletter and updates</span>
              </label>
            </div>
          </section>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Submit Registration
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
