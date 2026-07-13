import  { useState, useRef } from 'react';
import {  Download,  AlertCircle } from 'lucide-react';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import logo from "../assets/logo.png";

import './GenerateResume.css';

// Initial state for the resume data, starts completely empty as per requirements
const initialResumeData = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    city: '',
    state: '',
    country: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    languages: [],
    frameworks: [],
    databases: [],
    tools: [],
    cloud: [],
    other: [],
  },
  certifications: [],
  achievements: [],
  positions: [],
  extracurriculars: [],
  languages: [],
  interests: [],
};

export default function App() {
  // Central Resume State
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('ats_resume_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local storage data', e);
      }
    }
    return initialResumeData;
  });


  // PDF Generation loading state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');

  // Ref to target the print container
  const previewRef = useRef(null);

  // State update handlers
  const updatePersonalInfo = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Education Helpers
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { college: '', degree: '', branch: '', cgpa: '', startYear: '', endYear: '' },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  // Experience Helpers
  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', title: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.experience];
      if (field === 'currentlyWorking') {
        updated[index] = {
          ...updated[index],
          currentlyWorking: value,
          endDate: value ? '' : updated[index].endDate, // Clear end date if currently working
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index),
    }));
  };

  // Projects Helpers
  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: '', techStack: '', githubLink: '', liveDemoLink: '', description: '', achievements: '' },
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index),
    }));
  };

  // Skills Categories
  const updateSkills = (category, newTags) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: newTags,
      },
    }));
  };

  // Certifications Helpers
  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: '', org: '', date: '', url: '' },
      ],
    }));
  };

  const updateCertification = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.certifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const removeCertification = (index) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== index),
    }));
  };

  // Achievements Helpers
  const addAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ''],
    }));
  };

  const updateAchievement = (index, value) => {
    setResumeData((prev) => {
      const updated = [...prev.achievements];
      updated[index] = value;
      return { ...prev, achievements: updated };
    });
  };

  const removeAchievement = (index) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, idx) => idx !== index),
    }));
  };

  // Positions Helpers
  const addPosition = () => {
    setResumeData((prev) => ({
      ...prev,
      positions: [
        ...prev.positions,
        { role: '', org: '', duration: '', description: '' },
      ],
    }));
  };

  const updatePosition = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.positions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, positions: updated };
    });
  };

  const removePosition = (index) => {
    setResumeData((prev) => ({
      ...prev,
      positions: prev.positions.filter((_, idx) => idx !== index),
    }));
  };

  // Extracurriculars Helpers
  const addExtracurricular = () => {
    setResumeData((prev) => ({
      ...prev,
      extracurriculars: [...prev.extracurriculars, ''],
    }));
  };

  const updateExtracurricular = (index, value) => {
    setResumeData((prev) => {
      const updated = [...prev.extracurriculars];
      updated[index] = value;
      return { ...prev, extracurriculars: updated };
    });
  };

  const removeExtracurricular = (index) => {
    setResumeData((prev) => ({
      ...prev,
      extracurriculars: prev.extracurriculars.filter((_, idx) => idx !== index),
    }));
  };

  // Languages Helpers
  const addLanguage = () => {
    setResumeData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { name: '', proficiency: '' },
      ],
    }));
  };

  const updateLanguage = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.languages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languages: updated };
    });
  };

  const removeLanguage = (index) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, idx) => idx !== index),
    }));
  };

  // Interests Tags
  const updateInterests = (newTags) => {
    setResumeData((prev) => ({
      ...prev,
      interests: newTags,
    }));
  };

  // Clear Form handler
  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setResumeData(initialResumeData);
      localStorage.removeItem('ats_resume_data');
    }
  };

  // PDF Generation Handler
  const downloadPdf = async () => {
    const fullName = resumeData.personalInfo.fullName?.trim() || 'Resume';
    const element = previewRef.current;
    if (!element) {
      setPdfError('Preview content not found.');
      return;
    }

    setIsGeneratingPdf(true);
    setPdfError('');

    try {
      // Import dependencies dynamically to avoid SSR or bundle footprint issues
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Create a duplicate/style element context to avoid container scale scaling
      // We will clone the preview container and render it off-screen at full size
      const originalWidth = element.style.width;
      const originalTransform = element.style.transform;
      
      // Temporarily reset scaling for html2canvas to render accurately
      element.style.transform = 'scale(1)';
      element.style.width = '8.27in'; // Force actual standard width

      // Scroll to top of preview so canvas handles offsets correctly
      const scrollPos = element.scrollTop;
      element.scrollTop = 0;

      // Render the element to canvas
      const canvas = await html2canvas(element, {
        scale: 2.5, // Increase scale for high resolution print
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Restore styling properties
      element.style.transform = originalTransform;
      element.style.width = originalWidth;
      element.scrollTop = scrollPos;

      // Page calculations
      const imgWidth = 210; // A4 standard width in mm
      const pageHeight = 297; // A4 standard height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const filename = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(filename);

    } catch (err) {
      console.error('PDF Generation Error:', err);
      setPdfError('An error occurred while generating the PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header bar */}
      <header className="app-header glass-panel">

        <div className="brand-section">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
      
          <h1 className="brand-name">Resume Builder</h1>
        </div>

      </header>

      {/* Main Form + Preview Workspace */}
      <main className="workspace-grid">
        {/* Left Side (40%) - Form */}
        <section className="form-column">
          <ResumeForm
            data={resumeData}
            updatePersonalInfo={updatePersonalInfo}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            addExperience={addExperience}
            updateExperience={updateExperience}
            removeExperience={removeExperience}
            addProject={addProject}
            updateProject={updateProject}
            removeProject={removeProject}
            updateSkills={updateSkills}
            addCertification={addCertification}
            updateCertification={updateCertification}
            removeCertification={removeCertification}
            addAchievement={addAchievement}
            updateAchievement={updateAchievement}
            removeAchievement={removeAchievement}
            addPosition={addPosition}
            updatePosition={updatePosition}
            removePosition={removePosition}
            addExtracurricular={addExtracurricular}
            updateExtracurricular={updateExtracurricular}
            removeExtracurricular={removeExtracurricular}
            addLanguage={addLanguage}
            updateLanguage={updateLanguage}
            removeLanguage={removeLanguage}
            updateInterests={updateInterests}
            clearForm={clearForm}
          />
        </section>

        {/* Right Side (60%) - Sticky Preview & Score Dashboard */}
        <section className="preview-column">
          {/* Sticky Controls */}
          <div className="preview-sticky-control glass-panel">
            <div className="preview-controls-left">
              <h3>Live Resume Preview</h3>
            </div>
            
            <button
              onClick={downloadPdf}
              disabled={isGeneratingPdf}
              className="btn btn-primary"
            >
              {isGeneratingPdf ? (
                <>
                  <span className="spinner" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Download Resume (PDF)</span>
                </>
              )}
            </button>
          </div>

          {pdfError && (
            <div className="warning-item critical">
              <AlertCircle size={16} />
              <span>{pdfError}</span>
            </div>
          )}

          {/* Live Print-Friendly Preview */}
          <ResumePreview data={resumeData} previewRef={previewRef} />
        </section>
      </main>
    </div>
  );
}
