import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * TagInput Component
 * Allows entering tags (for skills, interests) with Enter, comma, or blur.
 * Features automatic deduplication and simple tag deletion.
 */
export default function TagInput({
  label,
  tags = [],
  onChange,
  placeholder = 'Type and press Enter or comma',
  required = false,
  error = '',
  className = '',
}) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Check if tag already exists (case-insensitive check)
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      const updatedTags = [...tags, trimmed];
      onChange(updatedTags);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleBlur = () => {
    addTag(inputValue);
  };

  const removeTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedTags);
  };

  return (
    <div className={`tag-input-container ${className}`}>
      {label && (
        <div className="tag-input-header">
          <label className="tag-input-label">
            {label}
            {required && tags.length === 0 && <span className="required-indicator" aria-hidden="true"> *</span>}
          </label>
          {required && tags.length === 0 && (
            <span className="tag-required-hint">At least one required</span>
          )}
        </div>
      )}

      <div className="tag-input-wrapper">
        <div className="tags-list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-badge">
              <span className="tag-text">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="tag-remove-button"
                aria-label={`Remove tag ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="tag-raw-input"
          />
        </div>
      </div>
      {error && <p className="form-field-error-message" role="alert">{error}</p>}
    </div>
  );
}
