import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rolesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/roles.json'), 'utf8'));

export const matchRoles = (matchedSkills) => {
  const matchedSkillNames = matchedSkills.map(skill => skill.name.toLowerCase());
  
  const rolesWithScores = rolesData.map(roleObj => {
    const required = roleObj.requiredSkills.map(s => s.toLowerCase());
    let matchCount = 0;
    
    required.forEach(reqSkill => {
      if (matchedSkillNames.includes(reqSkill)) {
        matchCount++;
      }
    });
    
    const matchPercentage = required.length > 0 ? Math.round((matchCount / required.length) * 100) : 0;
    
    let level = 'Potential Match';
    if (matchPercentage >= 90) level = 'Excellent Match';
    else if (matchPercentage >= 80) level = 'Strong Match';
    else if (matchPercentage >= 70) level = 'Good Match';
    
    return {
      role: roleObj.role,
      match: matchPercentage,
      level
    };
  });
  
  // Sort by match percentage descending and return top 5
  return rolesWithScores.sort((a, b) => b.match - a.match).slice(0, 5);
};
