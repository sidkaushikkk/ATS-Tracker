import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { matchRoles } from './roleMatcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/skills.json'), 'utf8'));

export const analyzeResumeContent = (text) => {
  const problems = [];
  const suggestions = [];
  const keyObservations = [];
  const matchedKeywords = [];
  
  let score = 100;
  
  // Convert text to lowercase for easier searching
  const lowerText = text.toLowerCase();
  
  // 1. Keyword Matching
  skillsData.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      matchedKeywords.push({ name: skill, value: Math.floor(Math.random() * 20) + 80 }); // Assign a random high value between 80-100 for visual effect
    }
  });

  if (matchedKeywords.length > 5) {
    keyObservations.push("Good technical skills listing detected.");
  } else {
    problems.push("Limited ATS keywords matching targeted listings.");
    suggestions.push("Increase keyword density of key libraries and technologies.");
    score -= 10;
  }

  // 2. Length check
  if (text.length < 500) {
    problems.push("Resume is very short.");
    suggestions.push("Expand on your experiences and projects.");
    score -= 15;
  } else if (text.length > 5000) {
    keyObservations.push("Resume is quite detailed.");
  }

  // 3. Section checks (heuristic based on common headers)
  const hasExperience = lowerText.includes("experience") || lowerText.includes("work history") || lowerText.includes("employment");
  const hasEducation = lowerText.includes("education") || lowerText.includes("university") || lowerText.includes("college");
  const hasProjects = lowerText.includes("project");
  
  if (!hasExperience && !hasProjects) {
    problems.push("No experience or projects section detected.");
    suggestions.push("Add a dedicated section for your work experience or projects.");
    score -= 20;
  } else if (hasExperience) {
    keyObservations.push("Experience section found.");
  }

  if (!hasEducation) {
    problems.push("Education section is missing or unclear.");
    suggestions.push("Ensure your education history is clearly marked.");
    score -= 10;
  }

  // 4. Contact info checks
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const hasEmail = emailRegex.test(text);
  const hasLinkedIn = lowerText.includes("linkedin.com");
  const hasGithub = lowerText.includes("github.com");

  if (!hasEmail) {
    problems.push("No email address found.");
    suggestions.push("Add a professional email address for contact.");
    score -= 10;
  }
  
  if (!hasLinkedIn && !hasGithub) {
    suggestions.push("Consider adding links to your LinkedIn profile or GitHub portfolio.");
  }

  // 5. Action words (heuristic)
  const actionWords = ["developed", "created", "led", "managed", "designed", "optimized", "spearheaded"];
  let actionWordCount = 0;
  actionWords.forEach(word => {
    if (lowerText.includes(word)) actionWordCount++;
  });
  
  if (actionWordCount >= 3) {
    keyObservations.push("Strong action verbs used in descriptions.");
  } else {
    problems.push("Generic experience descriptions lacking clear action words.");
    suggestions.push("Improve action verbs (e.g. designed, spearheaded, optimized).");
    score -= 5;
  }

  // 6. Metrics and quantified achievements
  const numbersRegex = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?%?\b/; // Matches numbers or percentages
  const matches = text.match(numbersRegex);
  if (matches && matches.length > 3) {
    keyObservations.push("Quantified achievements detected.");
  } else {
    problems.push("Missing quantified achievements inside work history lines.");
    suggestions.push("Add measurable achievements using percentages and metric growth.");
    score -= 5;
  }

  // Generate Roles
  const recommendedRoles = matchRoles(matchedKeywords);

  return {
    overallScore: Math.max(0, score),
    matchedKeywords,
    recommendedRoles,
    problems,
    suggestions,
    keyObservations
  };
};
