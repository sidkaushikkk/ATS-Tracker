import React, { useState } from 'react';
import { GripVertical, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { DEFAULT_SECTION_ORDER, SECTION_META } from '../constants/sectionOrder';
import './SectionOrderManager.css';

export default function SectionOrderManager({
  sectionOrder = DEFAULT_SECTION_ORDER,
  onChangeOrder,
  onResetOrder,
  data = {},
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Helper to check if a section currently has content in resumeData
  const hasContent = (key) => {
    switch (key) {
      case 'summary':
        return Boolean(data.personalInfo?.summary);
      case 'skills':
        return Object.values(data.skills || {}).some((arr) => arr && arr.length > 0);
      case 'experience':
        return Boolean(data.experience && data.experience.length > 0);
      case 'projects':
        return Boolean(data.projects && data.projects.length > 0);
      case 'education':
        return Boolean(data.education && data.education.length > 0);
      case 'certifications':
        return Boolean(data.certifications && data.certifications.length > 0);
      case 'achievements':
        return Boolean(data.achievements && data.achievements.length > 0);
      case 'positions':
        return Boolean(data.positions && data.positions.length > 0);
      case 'extracurriculars':
        return Boolean(data.extracurriculars && data.extracurriculars.length > 0);
      case 'languages':
        return Boolean(data.languages && data.languages.length > 0);
      case 'interests':
        return Boolean(data.interests && data.interests.length > 0);
      default:
        return false;
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newOrder = [...sectionOrder];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    onChangeOrder(newOrder);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...sectionOrder];
    const [item] = newOrder.splice(index, 1);
    newOrder.splice(index - 1, 0, item);
    onChangeOrder(newOrder);
  };

  const moveDown = (index) => {
    if (index === sectionOrder.length - 1) return;
    const newOrder = [...sectionOrder];
    const [item] = newOrder.splice(index, 1);
    newOrder.splice(index + 1, 0, item);
    onChangeOrder(newOrder);
  };

  return (
    <div className="section-order-container">
      <div className="section-order-header">
        <span className="section-order-subtitle">
          Drag cards or use arrows to rearrange section order on your resume.
        </span>
        <button
          type="button"
          className="btn-reset-order"
          onClick={onResetOrder}
          title="Reset to default order"
        >
          <RotateCcw size={14} />
          <span>Reset Order</span>
        </button>
      </div>

      <div className="section-order-list">
        {sectionOrder.map((key, index) => {
          const meta = SECTION_META[key] || { label: key };
          const active = hasContent(key);

          return (
            <div
              key={key}
              className={`section-order-card ${draggedIndex === index ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="card-drag-handle" title="Drag to reorder">
                <GripVertical size={18} />
              </div>

              <div className="card-info">
                <span className="card-number">{index + 1}</span>
                <span className="card-label">{meta.label}</span>
              </div>

              <div className="card-actions">
                <span className={`content-badge ${active ? 'badge-active' : 'badge-empty'}`}>
                  {active ? 'Active' : 'Empty'}
                </span>

                <div className="arrow-controls">
                  <button
                    type="button"
                    className="btn-arrow"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    title="Move section up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-arrow"
                    onClick={() => moveDown(index)}
                    disabled={index === sectionOrder.length - 1}
                    title="Move section down"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
