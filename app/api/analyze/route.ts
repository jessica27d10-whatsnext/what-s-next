import Groq from "groq-sdk";
import { NextResponse } from "next/server";
export const runtime = "nodejs"

const ADVISOR_SYSTEM_PROMPT = `You are an expert AI Career Advisor and Workforce Analyst.
Your job is to provide ACCURATE, NON-GENERIC, ROLE-SPECIFIC career guidance.
You must strictly follow the rules below.

==========================
GLOBAL RULES (MANDATORY)
==========================
1. Never assume skills or experience that are not explicitly mentioned.
2. If information is missing, infer cautiously and mark it as "Unknown".
3. Do NOT generate skill gaps, roadmaps, or forecasts unless a target career is explicitly provided.
4. All outputs must be grounded in:
   - User profile data
   - Extracted resume text OR manually entered data
5. Avoid repetition, filler text, and generic advice.
6. Output must be structured, deterministic, and consistent.

==========================
TASK 1: CAREER RECOMMENDATIONS
==========================
Only perform this task when:
- No targetCareer is provided

Objective:
Generate EXACTLY 5 career recommendations ranked by suitability.

For each career:
- Compute a realistic match score (0–100)
- Base scoring on:
  - Skill overlap
  - Experience alignment
  - Interest alignment
  - Market relevance
- Explain the reasoning briefly

OUTPUT FORMAT (JSON ONLY):
{
  "careerRecommendations": [
    {
      "rank": 1,
      "career": "",
      "matchScore": 0,
      "reason": "",
      "requiredCoreSkills": [],
      "industry": "",
      "growthPotential": "",
      "salaryRangeUSD": ""
    }
  ]
}

==========================
TASK 2: CAREER-SPECIFIC ANALYSIS
==========================
Only perform this task when:
- targetCareer IS PROVIDED

Objective:
Provide deep analysis strictly for the selected career.

SUBTASKS:
1. Skill Gap Analysis
2. Career Roadmap
3. Job Market Forecast

--------------------------------
1️⃣ SKILL GAP ANALYSIS
--------------------------------
Compare:
- User’s current skills
vs
- Skills required for targetCareer

For each missing or weak skill:
- Show currentLevel → requiredLevel
- Assign importance (High / Medium / Low)
- Suggest realistic learning resources

--------------------------------
2️⃣ CAREER ROADMAP
--------------------------------
Create a time-bound roadmap (6–18 months).
Each phase must include:
- Skills to acquire
- Practical actions
- Clear success metrics

--------------------------------
3️⃣ JOB MARKET FORECAST
--------------------------------
Forecast must be ONLY for targetCareer.

Include:
- Current demand
- Growth outlook
- Salary trend
- Emerging skills (next 2–3 years)

OUTPUT FORMAT (JSON ONLY):
{
  "targetCareer": "",
  "skillGapAnalysis": [
    {
      "skill": "",
      "currentLevel": "",
      "requiredLevel": "",
      "importance": "",
      "resources": []
    }
  ],
  "careerRoadmap": [
    {
      "phase": "",
      "duration": "",
      "focus": [],
      "actions": [],
      "successMetrics": []
    }
  ],
  "jobMarketForecast": {
    "demand": "",
    "growthOutlook": "",
    "salaryTrend": "",
    "emergingSkills": []
  }
}
`;

const EXTRACTION_PROMPT = `You are a strict resume information extraction engine.
Extract structured data from a resume with HIGH accuracy.

{
  "name": "",
  "classification": "fresher" | "experienced",
  "current_role": "",
  "years_of_experience": number,
  "education": [],
  "skills": [],
  "interests": []
}

Rules:
- classification: "fresher" (0-1yr) or "experienced" (1+ yrs).
- Normalize skills.
- Return ONLY JSON.`;

export async function POST(req: Request) {
  try {
    const { type, data, targetCareer } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    let profile = data.profile;

    // If data is coming from resume and we don't have a profile yet, extract it
    if (type === "resume" && !profile) {
      const extractionInput = `RESUME TEXT:\n\n${data.text}`;
      const extractionCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: EXTRACTION_PROMPT },
          { role: "user", content: extractionInput },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        response_format: { type: "json_object" },
      });
      const extractionContent = extractionCompletion.choices[0]?.message?.content || "";
      profile = JSON.parse(extractionContent);
    } else if (type === "manual" && !profile) {
      profile = {
        name: data.name || null,
        classification: data.type === "fresher" ? "fresher" : "experienced",
        current_role: data.currentRole || null,
        years_of_experience: parseInt(data.yearsOfExperience) || 0,
        education: data.education ? [data.education] : [],
        skills: data.skills ? data.skills.split(",").map((s: string) => s.trim()) : [],
        interests: data.interests ? data.interests.split(",").map((s: string) => s.trim()) : []
      };
    }

    // Now perform Task 1 or Task 2
    const inputMode = type === "resume" ? "RESUME" : "MANUAL";
    const userInput = `MODE = "${inputMode}"\nUSER PROFILE:\n${JSON.stringify(profile, null, 2)}${targetCareer ? `\n\ntargetCareer = "${targetCareer}"` : ""}`;

    const advisorCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ADVISOR_SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: targetCareer ? 0.3 : 0.1, // Task 2 slightly more creative, Task 1 deterministic
      response_format: { type: "json_object" },
    });

    const advisorContent = advisorCompletion.choices[0]?.message?.content || "";
    const advisorResult = JSON.parse(advisorContent);

    // Include profile in Task 1 response for frontend persistence
    if (!targetCareer) {
      return NextResponse.json({
        ...advisorResult,
        profile
      });
    }

    return NextResponse.json(advisorResult);

  } catch (error: any) {
    console.error("AI Generation Error:", error);

    // Handle Groq Rate Limits specifically
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: "Rate limit reached",
          details: error.message || "Please try again in a few minutes.",
          isRateLimit: true
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
