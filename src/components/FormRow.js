import React from 'react';
import './FormRow.css';

const FormRow = ({ 
  label, 
  children, 
  hint, 
  required = false, 
  error = null,
  className = '' 
}) => {
  return (
    <div className={`form-row ${className} ${error ? 'has-error' : ''}`}>
      <label className="form-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <div className="form-control">
        {children}
      </div>
      {hint && <small className="form-hint">{hint}</small>}
      {error && <small className="form-error">{error}</small>}
    </div>
  );
};

export default FormRow;
