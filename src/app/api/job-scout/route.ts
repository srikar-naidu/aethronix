import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = (process.env.GROQ_RESUME_API_KEY || '').trim();
        if (!apiKey) {
            return NextResponse.json({ error: 'Server configuration error: missing GROQ API Key' }, { status: 500 });
        }

        const groq = new Groq({ apiKey });
        const body = await req.json();
        const { action } = body;

        // ────────── ACTION: SEARCH JOBS ──────────
        if (action === 'search') {
            const { candidateProfile, preferences } = body;

            if (!candidateProfile) {
                return NextResponse.json({ error: 'Candidate profile is required' }, { status: 400 });
            }

            const searchPrompt = `
You are an elite AI Job Scout Agent that scans job portals (LinkedIn, Naukri, Indeed, Glassdoor, AngelList, Wellfound) and finds the best-fit jobs for a candidate.

CANDIDATE PROFILE:
"""
${candidateProfile}
"""

PREFERENCES:
- Desired Salary Range: ${preferences?.salaryRange || 'Any'}
- Preferred Location: ${preferences?.location || 'Any (Remote preferred)'}
- Work Mode: ${preferences?.workMode || 'Any'}
- Experience Level: ${preferences?.experienceLevel || 'Auto-detect from profile'}

YOUR MISSION:
1. Analyze the candidate's skills, experience depth, project complexity, and career trajectory
2. Generate 8 REALISTIC job listings that would actually exist on major job portals right now
3. Score each job based on: skill match, salary fit, experience alignment, growth potential
4. Be BRUTALLY HONEST about match scores — don't inflate
5. Include a mix of: perfect matches, stretch roles, and safe bets
6. If the candidate has fewer years than required but their projects demonstrate equivalent skill depth, note this as "experience_compensated": true

CRITICAL RULES:
- Jobs MUST be realistic (real company types, real salary ranges for India/global market)
- Include a mix of startups, mid-size, and large companies
- Salary ranges must be realistic for the role and location
- Tech stacks must be realistic combinations
- Don't just match keywords — understand skill depth

OUTPUT FORMAT (STRICT JSON):
{
  "candidate_summary": {
    "detected_role": "string (e.g., 'Full Stack Developer')",
    "experience_level": "string (junior/mid/senior)",
    "primary_skills": ["string"],
    "secondary_skills": ["string"],
    "estimated_market_value": "string (salary range)"
  },
  "jobs": [
    {
      "id": "number (1-8)",
      "title": "string",
      "company": "string",
      "company_type": "string (startup/mid-size/enterprise/mnc)",
      "location": "string",
      "work_mode": "string (remote/hybrid/onsite)",
      "salary_range": "string",
      "experience_required": "string",
      "posted_ago": "string (e.g., '2 days ago')",
      "applicants": "number",
      "tech_stack": ["string"],
      "key_requirements": ["string (top 4-5 requirements)"],
      "match_score": "number (0-100, be honest)",
      "match_reasoning": "string (1-2 sentences why this score)",
      "skill_overlap": ["string (skills candidate HAS that job needs)"],
      "skill_gaps": ["string (skills candidate is MISSING)"],
      "experience_compensated": "boolean (true if projects prove equivalent depth despite fewer years)",
      "compensation_note": "string (explanation if experience_compensated is true, empty otherwise)",
      "worth_applying": "boolean",
      "worth_reasoning": "string (why or why not worth applying)",
      "priority": "string (high/medium/low)"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object. No extra text. Be realistic and honest.
`;

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: searchPrompt }],
                response_format: { type: 'json_object' },
                temperature: 0.3,
                max_tokens: 4096,
            });

            const result = JSON.parse(completion.choices[0].message.content || '{}');
            return NextResponse.json(result);
        }

        // ────────── ACTION: ANALYZE & GENERATE RESUME ──────────
        if (action === 'analyze') {
            const { candidateProfile, job } = body;

            if (!candidateProfile || !job) {
                return NextResponse.json({ error: 'Candidate profile and job details are required' }, { status: 400 });
            }

            const analyzePrompt = `
You are an elite Career Intelligence Agent — a combination of Senior Recruiter, Technical Hiring Manager, and Resume Expert.

STRICT RULES:
- NEVER fabricate or assume experience, skills, or projects
- ONLY use actual data from the candidate profile
- You may rephrase and optimize, but NEVER invent
- Be brutally honest in evaluation
- Do NOT add fake metrics or experience

CANDIDATE PROFILE:
"""
${candidateProfile}
"""

TARGET JOB:
- Title: ${job.title}
- Company: ${job.company} (${job.company_type})
- Location: ${job.location} (${job.work_mode})
- Salary: ${job.salary_range}
- Experience Required: ${job.experience_required}
- Tech Stack: ${job.tech_stack?.join(', ')}
- Key Requirements: ${job.key_requirements?.join(', ')}

YOUR MISSION:
1. Deep-analyze how well the candidate fits THIS specific job
2. If the job requires X years experience but the candidate has fewer years, check if their projects demonstrate equivalent depth — if yes, craft the resume to highlight this
3. Generate an ATS-optimized resume TAILORED for this exact job
4. The resume should truthfully reorder, rephrase, and emphasize relevant skills/projects
5. Use strong action verbs, quantify where possible from REAL data only
6. Generate a skill gap analysis with actionable learning plan

OUTPUT FORMAT (STRICT JSON):
{
  "deep_analysis": {
    "match_score": "number (0-100)",
    "top_strengths": ["string"],
    "critical_gaps": ["string"],
    "experience_compensation": {
      "applies": "boolean",
      "explanation": "string (how projects prove equivalent depth)"
    },
    "hidden_advantages": ["string (things the candidate has that aren't obvious requirements but add value)"],
    "interview_topics_to_prepare": ["string"],
    "estimated_success_rate": "string (e.g., '65% — strong profile but missing Docker experience')"
  },
  "tailored_resume": {
    "content": "string (full ATS-optimized resume text tailored for this job — include name, contact, summary, skills, experience, projects, education)"
  },
  "skill_gap_plan": {
    "critical_gaps": [
      {
        "skill": "string",
        "action": "string (specific learning recommendation)",
        "time_estimate": "string (e.g., '2 weeks')"
      }
    ],
    "recommended_project": {
      "title": "string",
      "description": "string",
      "skills_covered": ["string"]
    }
  },
  "application_tips": ["string (3-4 specific tips for this application)"]
}

IMPORTANT: Return ONLY the JSON object. No extra text. Resume content must be TRUTHFUL.
`;

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: analyzePrompt }],
                response_format: { type: 'json_object' },
                temperature: 0.15,
                max_tokens: 4096,
            });

            const result = JSON.parse(completion.choices[0].message.content || '{}');
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Invalid action. Use "search" or "analyze"' }, { status: 400 });

    } catch (error: any) {
        console.error('[Job Scout API Error]:', error);
        return NextResponse.json({
            error: 'Failed to process request',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}
