import React from 'react';

/**
 * ResumePreview Component
 * Renders the resume following strict ATS guidelines:
 * - Single column layout
 * - No tables, graphics, icons, progress bars, or images
 * - Black text on white background
 * - Professional system serif/sans-serif typography
 * - Ordered sections: Name, Contact, Summary, Skills, Experience, Projects, Education,
 *   Certifications, Achievements, Positions of Responsibility, Extracurriculars, Languages, Interests
 * - Empty sections are hidden automatically
 */
export default function ResumePreview({ data, previewRef }) {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    projects = [],
    skills = {},
    certifications = [],
    achievements = [],
    positions = [],
    extracurriculars = [],
    languages = [],
    interests = [],
  } = data;

  // Check if contact info exists
  const hasContact =
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.linkedin ||
    personalInfo.github ||
    personalInfo.portfolio ||
    personalInfo.city ||
    personalInfo.state ||
    personalInfo.country;

  // Check if a skill category has entries
  const hasSkills = Object.values(skills).some((arr) => arr && arr.length > 0);

  return (
    <div className="resume-preview-wrapper">
      <div 
        id="resume-print-area" 
        ref={previewRef} 
        className="resume-preview-container"
        style={{
          backgroundColor: '#ffffff',
          color: '#111111',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: '1.45',
          fontSize: '11pt',
          padding: '1.2in 1.0in 1.2in 1.0in', // standard resume margins
          boxSizing: 'border-box',
          width: '8.27in', // standard A4 width
          minHeight: '11.69in', // standard A4 height
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Name section */}
        {personalInfo.fullName && (
          <div className="resume-section-header-center" style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '22pt', fontWeight: 'bold', margin: '0 0 6px 0', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
              {personalInfo.fullName}
            </h1>
            {personalInfo.professionalTitle && (
              <p style={{ fontSize: '13pt', fontWeight: '500', color: '#444444', margin: '0 0 8px 0' }}>
                {personalInfo.professionalTitle}
              </p>
            )}
          </div>
        )}

        {/* Contact Information section */}
        {hasContact && (
          <div className="resume-contact-bar" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '9pt',
            color: '#333333',
            marginBottom: '18px',
            borderBottom: '1px solid #222222',
            paddingBottom: '8px',
            textAlign: 'center'
          }}>
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && (personalInfo.email || personalInfo.linkedin || personalInfo.github || personalInfo.portfolio || personalInfo.city) && <span>|</span>}
            
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.email && (personalInfo.linkedin || personalInfo.github || personalInfo.portfolio || personalInfo.city) && <span>|</span>}

            {personalInfo.linkedin && (
              <span>
                {personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}
              </span>
            )}
            {personalInfo.linkedin && (personalInfo.github || personalInfo.portfolio || personalInfo.city) && <span>|</span>}

            {personalInfo.github && (
              <span>
                {personalInfo.github.replace(/^(https?:\/\/)?(www\.)?/, '')}
              </span>
            )}
            {personalInfo.github && (personalInfo.portfolio || personalInfo.city) && <span>|</span>}

            {personalInfo.portfolio && (
              <span>
                {personalInfo.portfolio.replace(/^(https?:\/\/)?(www\.)?/, '')}
              </span>
            )}
            {personalInfo.portfolio && (personalInfo.city || personalInfo.state || personalInfo.country) && <span>|</span>}

            {(personalInfo.city || personalInfo.state || personalInfo.country) && (
              <span>
                {[personalInfo.city, personalInfo.state, personalInfo.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        )}

        {/* Summary section */}
        {personalInfo.summary && (
          <div className="pdf-page-break-avoid" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 6px 0', paddingBottom: '2px' }}>
              Professional Summary
            </h2>
            <p style={{ margin: '0', fontSize: '10pt', textAlign: 'justify', color: '#111111' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Skills section */}
        {hasSkills && (
          <div className="pdf-page-break-avoid" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 6px 0', paddingBottom: '2px' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10pt' }}>
              {skills.languages && skills.languages.length > 0 && (
                <div style={{ margin: '0' }}>
                  <strong>Programming Languages: </strong>{skills.languages.join(', ')}
                </div>
              )}
              {skills.frameworks && skills.frameworks.length > 0 && (
                <div style={{ margin: '0' }}>
                  <strong>Frameworks & Libraries: </strong>{skills.frameworks.join(', ')}
                </div>
              )}
              {skills.databases && skills.databases.length > 0 && (
                <div style={{ margin: '0' }}>
                  <strong>Databases: </strong>{skills.databases.join(', ')}
                </div>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <div style={{ margin: '0' }}>
                  <strong>Developer Tools: </strong>{skills.tools.join(', ')}
                </div>
              )}
              {skills.cloud && skills.cloud.length > 0 && (
                <div style={{ margin: '0' }}>
                  <strong>Cloud Platforms: </strong>{skills.cloud.join(', ')}
                </div>
              )}
              {skills.other && skills.other.length > 0 && (
                <div style={{ margin: '0' }}>
                  <strong>Other Skills: </strong>{skills.other.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience section */}
        {experience && experience.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 8px 0', paddingBottom: '2px' }}>
              Professional Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={index} className="pdf-page-break-avoid" style={{ marginBottom: index === experience.length - 1 ? '0' : '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10pt', margin: '0' }}>
                  <span>{exp.title}</span>
                  <span>
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', fontStyle: 'italic', margin: '0 0 4px 0', color: '#333333' }}>
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.description && (
                  <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '10pt', color: '#111111', listStyleType: 'disc' }}>
                    {exp.description.split('\n').filter(Boolean).map((resp, rIdx) => (
                      <li key={rIdx} style={{ marginBottom: '2px', textAlign: 'justify' }}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects section */}
        {projects && projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 8px 0', paddingBottom: '2px' }}>
              Projects
            </h2>
            {projects.map((proj, index) => (
              <div key={index} className="pdf-page-break-avoid" style={{ marginBottom: index === projects.length - 1 ? '0' : '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10pt', margin: '0' }}>
                  <span>
                    {proj.name} {proj.techStack && <span style={{ fontWeight: 'normal', fontSize: '9pt', color: '#555555' }}>({proj.techStack})</span>}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '9pt', fontWeight: 'normal' }}>
                    {proj.githubLink && (
                      <span>
                        GitHub: {proj.githubLink.replace(/^(https?:\/\/)?(www\.)?/, '')}
                      </span>
                    )}
                    {proj.githubLink && proj.liveDemoLink && <span>|</span>}
                    {proj.liveDemoLink && (
                      <span>
                        Demo: {proj.liveDemoLink.replace(/^(https?:\/\/)?(www\.)?/, '')}
                      </span>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p style={{ margin: '2px 0 4px 0', fontSize: '10pt', color: '#222222', textAlign: 'justify' }}>
                    {proj.description}
                  </p>
                )}
                {proj.achievements && (
                  <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '10pt', color: '#111111', listStyleType: 'disc' }}>
                    {proj.achievements.split('\n').filter(Boolean).map((ach, aIdx) => (
                      <li key={aIdx} style={{ marginBottom: '2px', textAlign: 'justify' }}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education section */}
        {education && education.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 8px 0', paddingBottom: '2px' }}>
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="pdf-page-break-avoid" style={{ marginBottom: index === education.length - 1 ? '0' : '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10pt', margin: '0' }}>
                  <span>{edu.college}</span>
                  <span>{edu.startYear} – {edu.endYear}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', margin: '0', color: '#333333' }}>
                  <span>
                    {edu.degree} {edu.branch && `in ${edu.branch}`}
                  </span>
                  {edu.cgpa && <span>GPA/CGPA: {edu.cgpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications section */}
        {certifications && certifications.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 8px 0', paddingBottom: '2px' }}>
              Certifications
            </h2>
            {certifications.map((cert, index) => (
              <div key={index} className="pdf-page-break-avoid" style={{ marginBottom: index === certifications.length - 1 ? '0' : '6px', fontSize: '10pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0' }}>
                  <span>
                    <strong>{cert.name}</strong> — <em>{cert.org}</em>
                  </span>
                  <span>{cert.date}</span>
                </div>
                {cert.url && (
                  <div style={{ fontSize: '9pt', color: '#555555', margin: '1px 0 0 0' }}>
                    Credential URL: {cert.url.replace(/^(https?:\/\/)?(www\.)?/, '')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements section */}
        {achievements && achievements.length > 0 && (
          <div className="pdf-page-break-avoid" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 6px 0', paddingBottom: '2px' }}>
              Achievements
            </h2>
            <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '10pt', color: '#111111', listStyleType: 'disc' }}>
              {achievements.map((ach, index) => (
                <li key={index} style={{ marginBottom: '2px' }}>
                  {typeof ach === 'string' ? ach : ach.text || ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Positions of Responsibility section */}
        {positions && positions.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 8px 0', paddingBottom: '2px' }}>
              Positions of Responsibility
            </h2>
            {positions.map((pos, index) => (
              <div key={index} className="pdf-page-break-avoid" style={{ marginBottom: index === positions.length - 1 ? '0' : '8px', fontSize: '10pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', margin: '0' }}>
                  <span>{pos.role}</span>
                  <span>{pos.duration}</span>
                </div>
                <div style={{ fontStyle: 'italic', margin: '0 0 2px 0', color: '#333333' }}>
                  {pos.org}
                </div>
                {pos.description && (
                  <p style={{ margin: '0', fontSize: '9.5pt', color: '#222222', textAlign: 'justify' }}>
                    {pos.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Extracurricular Activities section */}
        {extracurriculars && extracurriculars.length > 0 && (
          <div className="pdf-page-break-avoid" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 6px 0', paddingBottom: '2px' }}>
              Extracurricular Activities
            </h2>
            <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '10pt', color: '#111111', listStyleType: 'disc' }}>
              {extracurriculars.map((act, index) => (
                <li key={index} style={{ marginBottom: '2px' }}>
                  {typeof act === 'string' ? act : act.activity || ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages section */}
        {languages && languages.length > 0 && (
          <div className="pdf-page-break-avoid" style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 6px 0', paddingBottom: '2px' }}>
              Languages
            </h2>
            <p style={{ margin: '0', fontSize: '10pt', color: '#111111' }}>
              {languages.map((lang, idx) => (
                <span key={idx}>
                  {lang.name} ({lang.proficiency}){idx < languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Interests section */}
        {interests && interests.length > 0 && (
          <div className="pdf-page-break-avoid" style={{ marginBottom: '0px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #222222', margin: '0 0 6px 0', paddingBottom: '2px' }}>
              Interests
            </h2>
            <p style={{ margin: '0', fontSize: '10pt', color: '#111111' }}>
              {interests.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
