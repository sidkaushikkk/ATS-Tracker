import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';

// Define the expected structured output schema for Zod validation
const AnalysisSchema = z.object({
  analysisType: z.enum(['application_match', 'general']),
  overallScore: z.number().int().min(0).max(100),
  summary: z.string(),
  sectionScores: z.object({
    contact: z.number().int().min(0).max(100),
    experience: z.number().int().min(0).max(100),
    skills: z.number().int().min(0).max(100),
    education: z.number().int().min(0).max(100),
    projects: z.number().int().min(0).max(100),
    writingImpact: z.number().int().min(0).max(100),
    atsReadability: z.number().int().min(0).max(100)
  }),
  strengths: z.array(z.object({
    title: z.string().catch("Strength"),
    evidence: z.string().catch("No specific evidence provided.")
  })).max(10),
  problems: z.array(z.object({
    title: z.string().catch("Observation"),
    severity: z.string().catch("medium"),
    evidence: z.string().catch("No specific evidence provided."),
    recommendation: z.string().catch("")
  })).max(10),
  matchedKeywords: z.array(z.object({
    name: z.string().catch("Keyword"),
    evidence: z.string().catch("")
  })).max(15),
  missingKeywords: z.array(z.object({
    name: z.string().catch("Keyword"),
    importance: z.string().catch("medium")
  })).max(15),
  recommendedRoles: z.array(z.object({
    role: z.string().catch("Role"),
    match: z.number().int().catch(50),
    reason: z.string().catch("")
  })).max(5),
  bulletRewrites: z.array(z.object({
    original: z.string().catch(""),
    suggested: z.string().catch(""),
    reason: z.string().catch("")
  })).max(5),
  disclaimer: z.string().catch("This is automated guidance, not a hiring decision.")
});

/**
 * Analyzes resume text against an optional job description using Gemini AI.
 * 
 * @param {string} resumeText - The extracted text of the resume.
 * @param {string} [jobDescription] - Optional job description to compare against.
 * @returns {Promise<z.infer<typeof AnalysisSchema>>} The validated analysis result.
 */
export async function analyzeWithGemini(resumeText, jobDescription = null) {
  // 1. Validate inputs
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text is empty.');
  }

  // Prevent excessively large payloads (e.g. > 100k chars is well over a normal resume)
  if (resumeText.length > 100000) {
    throw new Error('Resume text exceeds maximum length limits.');
  }

  // 2. Initialize GenAI SDK
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';

  // 3. Define the prompt
  let prompt = `
    You are an expert ATS (Applicant Tracking System) and senior technical recruiter. 
    Analyze the following resume. 
    
    CRITICAL RULES:
    1. NEVER invent or hallucinate skills, experience, education, achievements, or qualifications.
    2. If information is missing, mark it as unknown instead of guessing.
    3. Do NOT make definitive hiring decisions.
    4. Avoid protected-characteristic bias.
    5. Provide specific, actionable, truthful suggestions.
    6. All numeric scores must be integers from 0 to 100.
    7. KEEP ALL RESPONSES CONCISE AND PROFESSIONAL. All titles must be under 10 words. All evidence and descriptions must be brief (1-2 sentences max). Never output repetitive phrases or rambling text.
    
    Resume Text:
    """
    ${resumeText}
    """
  `;

  if (jobDescription && jobDescription.trim().length > 0) {
    prompt += `
    
    You must evaluate this resume against the following Job Description.
    Return an "Application Match Score" for the overall score.
    Make sure your missingKeywords are tailored to this job description.
    
    Job Description:
    """
    ${jobDescription}
    """
    `;
  } else {
    prompt += `
    
    No job description was provided. Return a "General Resume Quality Score" for the overall score.
    Evaluate the resume against general professional standards for whatever field the candidate is clearly targeting based on their experience and skills. Do not assume software engineering unless the resume indicates it.
    Suggest suitable job roles that match the candidate's actual profile.
    `;
  }

  // 4. Set up the schema for Gemini
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      analysisType: { type: Type.STRING, description: "Must be 'application_match' if a job description was provided, else 'general'." },
      overallScore: { type: Type.INTEGER, description: "0 to 100" },
      summary: { type: Type.STRING, description: "Concise candidate summary (max 3 sentences)." },
      sectionScores: {
        type: Type.OBJECT,
        properties: {
          contact: { type: Type.INTEGER, description: "0 to 100" },
          experience: { type: Type.INTEGER, description: "0 to 100" },
          skills: { type: Type.INTEGER, description: "0 to 100" },
          education: { type: Type.INTEGER, description: "0 to 100" },
          projects: { type: Type.INTEGER, description: "0 to 100" },
          writingImpact: { type: Type.INTEGER, description: "0 to 100" },
          atsReadability: { type: Type.INTEGER, description: "0 to 100" }
        }
      },
      strengths: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Concise title of strength (max 8 words)." },
            evidence: { type: Type.STRING, description: "Brief specific evidence from resume (max 2 sentences)." }
          }
        }
      },
      problems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Concise title of problem (max 8 words)." },
            severity: { type: Type.STRING, description: "'high', 'medium', or 'low'" },
            evidence: { type: Type.STRING, description: "Brief evidence from resume (max 2 sentences)." },
            recommendation: { type: Type.STRING, description: "Brief actionable fix (max 2 sentences)." }
          }
        }
      },
      matchedKeywords: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Keyword name (1-3 words)." },
            evidence: { type: Type.STRING, description: "Brief context line from resume." }
          }
        }
      },
      missingKeywords: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Missing keyword name (1-3 words)." },
            importance: { type: Type.STRING, description: "'high' or 'medium'" }
          }
        }
      },
      recommendedRoles: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING, description: "Job title (1-4 words)." },
            match: { type: Type.INTEGER, description: "Match percentage 0 to 100" },
            reason: { type: Type.STRING, description: "Brief 1-sentence reason." }
          }
        }
      },
      bulletRewrites: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING, description: "Original bullet point text." },
            suggested: { type: Type.STRING, description: "Improved action-oriented bullet point." },
            reason: { type: Type.STRING, description: "Brief 1-sentence explanation." }
          }
        }
      },
      disclaimer: { type: Type.STRING, description: "Must include: 'This is automated guidance, not a hiring decision.'" }
    },
    required: [
      "analysisType", "overallScore", "summary", "sectionScores", 
      "strengths", "problems", "matchedKeywords", "missingKeywords", 
      "recommendedRoles", "bulletRewrites", "disclaimer"
    ]
  };

  // 5. Call Gemini with Timeout
  // AbortController for timeout (45 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Keep it deterministic and factual
      }
    }, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Gemini returned an empty response.");
    }

    // 6. Parse and Validate with Zod
    const parsed = JSON.parse(rawJson);
    const validatedResult = AnalysisSchema.parse(parsed);

    // Helper to sanitize strings and guard against model token degeneration loops
    const sanitize = (text, maxLen = 300) => {
      if (!text || typeof text !== 'string') return '';
      let str = text.trim();
      // Remove repeating sentence artifacts if model got stuck
      if (str.length > maxLen) {
        str = str.substring(0, maxLen).trim() + '...';
      }
      return str;
    };

    const sanitizedStrengths = (validatedResult.strengths || []).map(s => ({
      title: sanitize(s.title, 100),
      evidence: sanitize(s.evidence, 300)
    }));

    const sanitizedProblems = (validatedResult.problems || []).map(p => ({
      title: sanitize(p.title, 100),
      severity: p.severity || 'medium',
      evidence: sanitize(p.evidence, 300),
      recommendation: sanitize(p.recommendation, 300)
    }));

    const sanitizedMatchedKeywords = (validatedResult.matchedKeywords || []).map(k => ({
      name: sanitize(k.name, 60),
      evidence: sanitize(k.evidence, 200)
    }));

    const sanitizedMissingKeywords = (validatedResult.missingKeywords || []).map(k => ({
      name: sanitize(k.name, 60),
      importance: k.importance || 'medium'
    }));

    const sanitizedRecommendedRoles = (validatedResult.recommendedRoles || []).map(r => ({
      role: sanitize(r.role, 60),
      match: typeof r.match === 'number' ? r.match : 50,
      reason: sanitize(r.reason, 200)
    }));

    const sanitizedBulletRewrites = (validatedResult.bulletRewrites || []).map(b => ({
      original: sanitize(b.original, 250),
      suggested: sanitize(b.suggested, 250),
      reason: sanitize(b.reason, 200)
    }));

    return {
      ...validatedResult,
      summary: sanitize(validatedResult.summary, 500),
      strengths: sanitizedStrengths,
      problems: sanitizedProblems,
      matchedKeywords: sanitizedMatchedKeywords,
      missingKeywords: sanitizedMissingKeywords,
      recommendedRoles: sanitizedRecommendedRoles,
      bulletRewrites: sanitizedBulletRewrites,
      aiModel: modelName,
      analysisVersion: '1.0.0'
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("[Gemini Analyzer Error]", error.name === 'AbortError' ? 'Timeout' : error.message);
    throw error;
  }
}
