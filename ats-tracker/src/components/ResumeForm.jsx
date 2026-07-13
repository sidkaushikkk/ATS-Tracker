import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Cpu,
  FileBadge,
  Trophy,
  Users,
  Gamepad,
  Globe,
  Heart,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import FormField from './FormField';
import TagInput from './TagInput';

/**
 * ResumeForm Component
 * Renders the form on the left column using a clean accordion design to prevent infinite scrolling.
 * Supports add/remove operations on all lists, form validation, and character counters.
 */
export default function ResumeForm({
  data,
  updatePersonalInfo,
  // Education
  addEducation,
  updateEducation,
  removeEducation,
  // Experience
  addExperience,
  updateExperience,
  removeExperience,
  // Projects
  addProject,
  updateProject,
  removeProject,
  // Skills
  updateSkills,
  // Certifications
  addCertification,
  updateCertification,
  removeCertification,
  // Achievements
  addAchievement,
  updateAchievement,
  removeAchievement,
  // Positions of Responsibility
  addPosition,
  updatePosition,
  removePosition,
  // Extracurriculars
  addExtracurricular,
  updateExtracurricular,
  removeExtracurricular,
  // Languages
  addLanguage,
  updateLanguage,
  removeLanguage,
  // Interests
  updateInterests,
  // Clear button
  clearForm,
}) {
  // State to track open/closed state of accordion sections
  const [activeSections, setActiveSections] = useState({
    personalInfo: true, // open by default
    skills: false,
    experience: false,
    projects: false,
    education: false,
    certifications: false,
    achievements: false,
    positions: false,
    extracurriculars: false,
    languages: false,
    interests: false,
  });

  const toggleSection = (section) => {
    setActiveSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const personalInfo = data.personalInfo || {};
  const education = data.education || [];
  const experience = data.experience || [];
  const projects = data.projects || [];
  const skills = data.skills || {};
  const certifications = data.certifications || [];
  const achievements = data.achievements || [];
  const positions = data.positions || [];
  const extracurriculars = data.extracurriculars || [];
  const languages = data.languages || [];
  const interests = data.interests || [];

  return (
    <div className="resume-form-wrapper">
      <div className="form-action-header">
        <h2 className="form-header-title">Resume Details</h2>
        <button
          type="button"
          onClick={clearForm}
          className="btn btn-secondary btn-small reset-form-btn"
        >
          Clear Form
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="resume-form-element">
        {/* ==================== 1. PERSONAL INFORMATION ==================== */}
        <div className={`accordion-item ${activeSections.personalInfo ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            
            onClick={() => toggleSection('personalInfo')}
          >
            <div className="accordion-title-group">
              <User size={18} className="accordion-icon" />
              <span>Personal Information</span>
            </div>
            {activeSections.personalInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          <div className="accordion-content">
            <div className="form-grid">
              <FormField
                label="Full Name"
                name="fullName"
                value={personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                required
              />
              <FormField
                label="Professional Title"
                name="professionalTitle"
                value={personalInfo.professionalTitle}
                onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}

                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}

                required
              />
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}

                required
              />
              <FormField
                label="LinkedIn URL"
                name="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}

              />
              <FormField
                label="GitHub URL"
                name="github"
                value={personalInfo.github}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}

              />
              <FormField
                label="Portfolio Website"
                name="portfolio"
                value={personalInfo.portfolio}
                onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}

              />
              <FormField
                label="City"
                name="city"
                value={personalInfo.city}
                onChange={(e) => updatePersonalInfo('city', e.target.value)}

              />
              <FormField
                label="State"
                name="state"
                value={personalInfo.state}
                onChange={(e) => updatePersonalInfo('state', e.target.value)}
              />
              <FormField
                label="Country"
                name="country"
                value={personalInfo.country}
                onChange={(e) => updatePersonalInfo('country', e.target.value)}
              />
            </div>
            
            <FormField
              label="Professional Summary"
              name="summary"
              type="textarea"
              value={personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              maxLength={500}
              rows={4}
              required
            />
          </div>
        </div>

        {/* ==================== 2. SKILLS CATEGORIES ==================== */}
        <div className={`accordion-item ${activeSections.skills ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('skills')}
          >
            <div className="accordion-title-group">
              <Cpu size={18} className="accordion-icon" />
              <span>Skills Categories</span>
              {Object.values(skills).some((arr) => arr.length > 0) && (
                <span className="section-badge-count">Filled</span>
              )}
            </div>
            {activeSections.skills ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          <div className="accordion-content">
            <div className="skills-form-grid">
              <TagInput
                label="Programming Languages"
                tags={skills.languages}
                onChange={(newTags) => updateSkills('languages', newTags)}
                placeholder="e.g. JavaScript, Python, Go, Java"
              />
              <TagInput
                label="Frameworks & Libraries"
                tags={skills.frameworks}
                onChange={(newTags) => updateSkills('frameworks', newTags)}
                placeholder="e.g. React, Next.js, Node.js, Vue"
              />
              <TagInput
                label="Databases"
                tags={skills.databases}
                onChange={(newTags) => updateSkills('databases', newTags)}
                placeholder="e.g. PostgreSQL, MongoDB, Redis"
              />
              <TagInput
                label="Developer Tools"
                tags={skills.tools}
                onChange={(newTags) => updateSkills('tools', newTags)}
                placeholder="e.g. Git, Docker, Webpack, Figma"
              />
              <TagInput
                label="Cloud Platforms"
                tags={skills.cloud}
                onChange={(newTags) => updateSkills('cloud', newTags)}
                placeholder="e.g. AWS, GCP, Vercel, Firebase"
              />
              <TagInput
                label="Other Skills"
                tags={skills.other}
                onChange={(newTags) => updateSkills('other', newTags)}
                placeholder="e.g. Agile, System Design, REST APIs"
              />
            </div>
          </div>
        </div>

        {/* ==================== 3. WORK EXPERIENCE ==================== */}
        <div className={`accordion-item ${activeSections.experience ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('experience')}
          >
            <div className="accordion-title-group">
              <Briefcase size={18} className="accordion-icon" />
              <span>Work Experience</span>
              {experience.length > 0 && (
                <span className="section-badge-count">{experience.length}</span>
              )}
            </div>
            {activeSections.experience ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {experience.map((exp, idx) => (
              <div key={idx} className="repeatable-form-card">
                <div className="repeatable-card-header">
                  <h4>Position #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="remove-card-btn text-danger"
                    aria-label="Remove Experience"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="form-grid">
                  <FormField
                    label="Company Name"
                    name={`exp-company-${idx}`}
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="e.g. Google"
                    required
                  />
                  <FormField
                    label="Job Title"
                    name={`exp-title-${idx}`}
                    value={exp.title}
                    onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                  <FormField
                    label="Location"
                    name={`exp-location-${idx}`}
                    value={exp.location}
                    onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                    placeholder="e.g. Mountain View, CA"
                  />
                  <FormField
                    label="Start Date"
                    name={`exp-startDate-${idx}`}
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    placeholder="e.g. June 2022"
                    required
                  />
                  <FormField
                    label="End Date"
                    name={`exp-endDate-${idx}`}
                    value={exp.endDate}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    placeholder="e.g. Dec 2024"
                    disabled={exp.currentlyWorking}
                    required={!exp.currentlyWorking}
                  />
                  <FormField
                    label="I currently work here"
                    name={`exp-currentlyWorking-${idx}`}
                    type="checkbox"
                    value={exp.currentlyWorking}
                    onChange={(e) => updateExperience(idx, 'currentlyWorking', e.target.checked)}
                  />
                </div>

                <FormField
                  label="Responsibilities (One per line for bullets)"
                  name={`exp-desc-${idx}`}
                  type="textarea"
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                  placeholder="Designed and developed high-scale distributed APIs using Go.&#10;Collaborated with product teams to deliver key features.&#10;Mentored 3 junior software engineers."
                  maxLength={1000}
                  rows={4}
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Experience</span>
            </button>
          </div>
        </div>

        {/* ==================== 4. PROJECTS ==================== */}
        <div className={`accordion-item ${activeSections.projects ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('projects')}
          >
            <div className="accordion-title-group">
              <FolderGit2 size={18} className="accordion-icon" />
              <span>Projects</span>
              {projects.length > 0 && (
                <span className="section-badge-count">{projects.length}</span>
              )}
            </div>
            {activeSections.projects ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {projects.map((proj, idx) => (
              <div key={idx} className="repeatable-form-card">
                <div className="repeatable-card-header">
                  <h4>Project #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="remove-card-btn text-danger"
                    aria-label="Remove Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="form-grid">
                  <FormField
                    label="Project Name"
                    name={`proj-name-${idx}`}
                    value={proj.name}
                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                    placeholder="e.g. Chat Application"
                    required
                  />
                  <FormField
                    label="Tech Stack"
                    name={`proj-stack-${idx}`}
                    value={proj.techStack}
                    onChange={(e) => updateProject(idx, 'techStack', e.target.value)}
                    placeholder="e.g. React, Socket.io, Node.js"
                    required
                  />
                  <FormField
                    label="GitHub Link"
                    name={`proj-github-${idx}`}
                    value={proj.githubLink}
                    onChange={(e) => updateProject(idx, 'githubLink', e.target.value)}
                    placeholder="e.g. github.com/user/project"
                  />
                  <FormField
                    label="Live Demo Link"
                    name={`proj-demo-${idx}`}
                    value={proj.liveDemoLink}
                    onChange={(e) => updateProject(idx, 'liveDemoLink', e.target.value)}
                    placeholder="e.g. project.dev"
                  />
                </div>

                <FormField
                  label="Description"
                  name={`proj-desc-${idx}`}
                  type="textarea"
                  value={proj.description}
                  onChange={(e) => updateProject(idx, 'description', e.target.value)}
                  placeholder="A real-time messaging application supporting multiple private rooms and rich emojis."
                  maxLength={500}
                  rows={2}
                />

                <FormField
                  label="Key Achievements (One per line for bullets)"
                  name={`proj-ach-${idx}`}
                  type="textarea"
                  value={proj.achievements}
                  onChange={(e) => updateProject(idx, 'achievements', e.target.value)}
                  placeholder="Optimized message latency by 40% using WebSockets connection pooling.&#10;Integrated AWS S3 for instant media sharing."
                  maxLength={1000}
                  rows={3}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addProject}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* ==================== 5. EDUCATION ==================== */}
        <div className={`accordion-item ${activeSections.education ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('education')}
          >
            <div className="accordion-title-group">
              <GraduationCap size={18} className="accordion-icon" />
              <span>Education</span>
              {education.length > 0 && (
                <span className="section-badge-count">{education.length}</span>
              )}
            </div>
            {activeSections.education ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {education.map((edu, idx) => (
              <div key={idx} className="repeatable-form-card">
                <div className="repeatable-card-header">
                  <h4>Education #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="remove-card-btn text-danger"
                    aria-label="Remove Education"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="form-grid">
                  <FormField
                    label="College / University"
                    name={`edu-college-${idx}`}
                    value={edu.college}
                    onChange={(e) => updateEducation(idx, 'college', e.target.value)}
                    placeholder="e.g. Stanford University"
                    required
                  />
                  <FormField
                    label="Degree"
                    name={`edu-degree-${idx}`}
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    required
                  />
                  <FormField
                    label="Branch / Major"
                    name={`edu-branch-${idx}`}
                    value={edu.branch}
                    onChange={(e) => updateEducation(idx, 'branch', e.target.value)}
                    placeholder="e.g. Computer Science"
                    required
                  />
                  <FormField
                    label="CGPA / Percentage"
                    name={`edu-cgpa-${idx}`}
                    value={edu.cgpa}
                    onChange={(e) => updateEducation(idx, 'cgpa', e.target.value)}
                    placeholder="e.g. 3.9/4.0 or 92%"
                  />
                  <FormField
                    label="Start Year"
                    name={`edu-startYr-${idx}`}
                    value={edu.startYear}
                    onChange={(e) => updateEducation(idx, 'startYear', e.target.value)}
                    placeholder="e.g. 2018"
                    required
                  />
                  <FormField
                    label="End Year"
                    name={`edu-endYr-${idx}`}
                    value={edu.endYear}
                    onChange={(e) => updateEducation(idx, 'endYear', e.target.value)}
                    placeholder="e.g. 2022"
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEducation}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Education</span>
            </button>
          </div>
        </div>

        {/* ==================== 6. CERTIFICATIONS ==================== */}
        <div className={`accordion-item ${activeSections.certifications ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('certifications')}
          >
            <div className="accordion-title-group">
              <FileBadge size={18} className="accordion-icon" />
              <span>Certifications</span>
              {certifications.length > 0 && (
                <span className="section-badge-count">{certifications.length}</span>
              )}
            </div>
            {activeSections.certifications ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {certifications.map((cert, idx) => (
              <div key={idx} className="repeatable-form-card">
                <div className="repeatable-card-header">
                  <h4>Certification #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCertification(idx)}
                    className="remove-card-btn text-danger"
                    aria-label="Remove Certification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="form-grid">
                  <FormField
                    label="Certification Name"
                    name={`cert-name-${idx}`}
                    value={cert.name}
                    onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    required
                  />
                  <FormField
                    label="Issuing Organization"
                    name={`cert-org-${idx}`}
                    value={cert.org}
                    onChange={(e) => updateCertification(idx, 'org', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    required
                  />
                  <FormField
                    label="Date"
                    name={`cert-date-${idx}`}
                    value={cert.date}
                    onChange={(e) => updateCertification(idx, 'date', e.target.value)}
                    placeholder="e.g. Nov 2023"
                  />
                  <FormField
                    label="Credential URL"
                    name={`cert-url-${idx}`}
                    value={cert.url}
                    onChange={(e) => updateCertification(idx, 'url', e.target.value)}
                    placeholder="e.g. credly.com/certs/123"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCertification}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Certification</span>
            </button>
          </div>
        </div>

        {/* ==================== 7. ACHIEVEMENTS ==================== */}
        <div className={`accordion-item ${activeSections.achievements ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('achievements')}
          >
            <div className="accordion-title-group">
              <Trophy size={18} className="accordion-icon" />
              <span>Achievements</span>
              {achievements.length > 0 && (
                <span className="section-badge-count">{achievements.length}</span>
              )}
            </div>
            {activeSections.achievements ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {achievements.map((ach, idx) => (
              <div key={idx} className="repeatable-form-card-small">
                <FormField
                  label={`Achievement #${idx + 1}`}
                  name={`ach-${idx}`}
                  value={ach}
                  onChange={(e) => updateAchievement(idx, e.target.value)}
                  placeholder="e.g. Winner - Hackathon 2024 (Out of 200 teams)"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeAchievement(idx)}
                  className="remove-small-btn text-danger"
                  aria-label="Remove Achievement"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addAchievement}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Achievement</span>
            </button>
          </div>
        </div>

        {/* ==================== 8. POSITIONS OF RESPONSIBILITY ==================== */}
        <div className={`accordion-item ${activeSections.positions ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('positions')}
          >
            <div className="accordion-title-group">
              <Users size={18} className="accordion-icon" />
              <span>Positions of Responsibility</span>
              {positions.length > 0 && (
                <span className="section-badge-count">{positions.length}</span>
              )}
            </div>
            {activeSections.positions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {positions.map((pos, idx) => (
              <div key={idx} className="repeatable-form-card">
                <div className="repeatable-card-header">
                  <h4>Position #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removePosition(idx)}
                    className="remove-card-btn text-danger"
                    aria-label="Remove Position"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="form-grid">
                  <FormField
                    label="Role"
                    name={`pos-role-${idx}`}
                    value={pos.role}
                    onChange={(e) => updatePosition(idx, 'role', e.target.value)}
                    placeholder="e.g. Technical Lead"
                    required
                  />
                  <FormField
                    label="Organization"
                    name={`pos-org-${idx}`}
                    value={pos.org}
                    onChange={(e) => updatePosition(idx, 'org', e.target.value)}
                    placeholder="e.g. University Coding Club"
                    required
                  />
                  <FormField
                    label="Duration"
                    name={`pos-dur-${idx}`}
                    value={pos.duration}
                    onChange={(e) => updatePosition(idx, 'duration', e.target.value)}
                    placeholder="e.g. May 2021 – May 2022"
                    required
                  />
                </div>

                <FormField
                  label="Description"
                  name={`pos-desc-${idx}`}
                  type="textarea"
                  value={pos.description}
                  onChange={(e) => updatePosition(idx, 'description', e.target.value)}
                  placeholder="Led a group of 15 members to coordinate national level workshops."
                  maxLength={500}
                  rows={2}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addPosition}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Position</span>
            </button>
          </div>
        </div>

        {/* ==================== 9. EXTRACURRICULAR ACTIVITIES ==================== */}
        <div className={`accordion-item ${activeSections.extracurriculars ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('extracurriculars')}
          >
            <div className="accordion-title-group">
              <Gamepad size={18} className="accordion-icon" />
              <span>Extracurricular Activities</span>
              {extracurriculars.length > 0 && (
                <span className="section-badge-count">{extracurriculars.length}</span>
              )}
            </div>
            {activeSections.extracurriculars ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {extracurriculars.map((act, idx) => (
              <div key={idx} className="repeatable-form-card-small">
                <FormField
                  label={`Activity #${idx + 1}`}
                  name={`act-${idx}`}
                  value={act}
                  onChange={(e) => updateExtracurricular(idx, e.target.value)}
                  placeholder="e.g. State-level Chess player"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeExtracurricular(idx)}
                  className="remove-small-btn text-danger"
                  aria-label="Remove Activity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addExtracurricular}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Activity</span>
            </button>
          </div>
        </div>

        {/* ==================== 10. LANGUAGES ==================== */}
        <div className={`accordion-item ${activeSections.languages ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('languages')}
          >
            <div className="accordion-title-group">
              <Globe size={18} className="accordion-icon" />
              <span>Languages</span>
              {languages.length > 0 && (
                <span className="section-badge-count">{languages.length}</span>
              )}
            </div>
            {activeSections.languages ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            {languages.map((lang, idx) => (
              <div key={idx} className="repeatable-form-card">
                <div className="repeatable-card-header">
                  <h4>Language #{idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeLanguage(idx)}
                    className="remove-card-btn text-danger"
                    aria-label="Remove Language"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="form-grid">
                  <FormField
                    label="Language"
                    name={`lang-name-${idx}`}
                    value={lang.name}
                    onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                    placeholder="e.g. English, Hindi, Spanish"
                    required
                  />
                  <FormField
                    label="Proficiency"
                    name={`lang-prof-${idx}`}
                    type="select"
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(idx, 'proficiency', e.target.value)}
                    placeholder="Select proficiency"
                    options={[
                      { value: 'Native', label: 'Native / Bilingual' },
                      { value: 'Fluent', label: 'Fluent / Full Professional' },
                      { value: 'Professional', label: 'Professional Working' },
                      { value: 'Conversational', label: 'Limited Working / Conversational' },
                      { value: 'Elementary', label: 'Elementary / Beginner' },
                    ]}
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addLanguage}
              className="btn btn-outline btn-full add-entry-btn"
            >
              <Plus size={16} />
              <span>Add Language</span>
            </button>
          </div>
        </div>

        {/* ==================== 11. INTERESTS ==================== */}
        <div className={`accordion-item ${activeSections.interests ? 'active' : ''}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => toggleSection('interests')}
          >
            <div className="accordion-title-group">
              <Heart size={18} className="accordion-icon" />
              <span>Interests</span>
              {interests.length > 0 && (
                <span className="section-badge-count">{interests.length}</span>
              )}
            </div>
            {activeSections.interests ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <div className="accordion-content">
            <TagInput
              tags={interests}
              onChange={updateInterests}
              placeholder="e.g. Open Source, Machine Learning, Football, Hiking"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
