import React from 'react';
import './SuccessModal.css';
import { useToast } from '../context/ToastContext';

const SuccessModal = ({ data, onClose }) => {
  const toast = useToast();

  const handleClose = () => {
    toast.info('We will notify you via email about further updates.');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>
        
        <h2 className="success-title">Application Submitted Successfully! 🎉</h2>
        
        <div className="success-message">
          <p className="main-message">
            Your academic course admission application has been successfully submitted to 
            <strong> Kongu Engineering College</strong>.
          </p>
          
          <div className="info-box">
            <h3>What's Next?</h3>
            <ul>
              <li>✓ You will receive a confirmation email shortly</li>
              <li>✓ Our admission team will review your application</li>
              <li>✓ You will be notified about the status within 3-5 working days</li>
              <li>✓ Keep checking your email for updates</li>
            </ul>
          </div>

          {data && data.data && (
            <div className="application-details">
              <h3>Application Details</h3>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{data.data.fullName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Course:</span>
                <span className="detail-value">{data.data.academicCourse}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{data.data.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Application ID:</span>
                <span className="detail-value">{data.data._id}</span>
              </div>
            </div>
          )}
        </div>

        <button className="close-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
