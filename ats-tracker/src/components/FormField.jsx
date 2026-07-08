import React from 'react';

/**
 * FormField Component
 * Reusable, accessible form input component supporting text inputs, textareas, select, and checkboxes.
 * Includes validation feedback, required field indicators, and character counters.
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  required = false,
  error = '',
  maxLength,
  options = [],
  rows = 3,
  disabled = false,
  className = '',
}) {
  const isTextarea = type === 'textarea';
  const isCheckbox = type === 'checkbox';
  const isSelect = type === 'select';

  // Calculate current character count for textareas/inputs with maxLength
  const showCounter = maxLength && typeof value === 'string';
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`form-field-container ${isCheckbox ? 'checkbox-field-container' : ''} ${className}`}>
      {!isCheckbox && label && (
        <div className="form-field-header">
          <label htmlFor={name} className="form-field-label">
            {label}
            {required && <span className="required-indicator" aria-hidden="true"> *</span>}
          </label>
          {showCounter && (
            <span className={`character-counter ${currentLength > maxLength * 0.95 ? 'counter-danger' : ''}`}>
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}

      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          required={required}
          disabled={disabled}
          className={`form-field-input form-field-textarea ${error ? 'input-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : isSelect ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`form-field-input form-field-select ${error ? 'input-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : isCheckbox ? (
        <label className="form-checkbox-label">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={!!value}
            onChange={onChange}
            disabled={disabled}
            className="form-field-checkbox"
          />
          <span className="checkbox-text-wrapper">
            <span className="checkbox-custom-box" />
            <span className="checkbox-label-text">
              {label}
              {required && <span className="required-indicator" aria-hidden="true"> *</span>}
            </span>
          </span>
        </label>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className={`form-field-input ${error ? 'input-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}

      {error && !isCheckbox && (
        <p className="form-field-error-message" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
