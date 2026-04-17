import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

async function fetchJobs(query: string) {
    const apiKey = (process.env.JSEARCH_API_KEY || process.env.JSEARCH_RAPIDAPI_KEY || '').trim();
    if (!apiKey) throw new Error("Missing JSearch API Key (check .env and restart server)");

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        throw new Error(`JSearch API failed. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
}

async function fetchFromGroq(prompt: string, expectJson: boolean = false, isQueryGen: boolean = false) {
    const keys = [
        process.env.GROQ_JOBSCOUT_API_KEY,
        process.env.GROQ_RESUME_API_KEY,
        process.env.GROQ_HIRE_API_KEY,
        process.env.GROQ_ROADMAP_API_KEY
    ].map(k => (k || '').trim()).filter(Boolean);

    if (keys.length === 0) throw new Error("Missing Groq API Keys");

    let lastError = null;
    for (const apiKey of keys) {
        try {
            console.log(`[Groq] Attempting with key: ${apiKey.substring(0, 8)}...`);
            const groq = new Groq({ apiKey });
            const completion = await groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                response_format: expectJson ? { type: 'json_object' } : undefined,
                temperature: isQueryGen ? 0.0 : 0.2,
                max_tokens: isQueryGen ? 50 : 4096,
            });
            return completion.choices[0].message.content;
        } catch (e: any) {
            lastError = e;
            // If it's a rate limit (429) or overload (503), try next key
            if (e.status === 429 || e.status === 503) {
                console.warn(`[Groq] Rate limited on key ${apiKey.substring(0, 8)}. Rotating...`);
                continue;
            }
            throw e; // For other errors (auth, etc.), throw immediately
        }
    }
    throw lastError || new Error("All Groq keys failed");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action } = body;

        // ────────── ACTION: SEARCH JOBS (JSEARCH PIPELINE) ──────────
        if (action === 'search') {
            const { candidateProfile, preferences } = body;

            if (!candidateProfile) {
                return NextResponse.json({ error: 'Candidate profile is required' }, { status: 400 });
            }

            console.log("JobScout: Building query...");
            const queryPrompt = `Generate exactly 1 short job search query (e.g. "React Developer in Hyderabad") using profile and location. NO quotes, NO extra words.\nLocation: ${preferences?.location || 'Any'}\nProfile: ${candidateProfile.substring(0, 200)}`;
            let finalQuery = "software developer";
            try {
                const rawGen = await fetchFromGroq(queryPrompt, false, true) || "software developer";
                finalQuery = rawGen.replace(/["']/g, '').trim();
            } catch(e) {
                console.error("Query generation failed, using default:", e);
            }
            
            // 🔥 Step 1: Fetch real jobs
            console.log(`[Job Scout] 🔍 Scraping jobs for: "${finalQuery}"`);
            const jobs = await fetchJobs(finalQuery);
            console.log(`[Job Scout] ✅ JSearch returned ${jobs?.length || 0} real jobs.`);

            if (!jobs || jobs.length === 0) {
                 return NextResponse.json({
                    candidate_summary: { detected_role: finalQuery, experience_level: "Unknown", primary_skills: [], secondary_skills: [], estimated_market_value: "Unknown" },
                    jobs: []
                 });
            }

            // 🔥 Step 2: Clean jobs
            const cleanedJobs = jobs.slice(0, 4).map((job: any, index: number) => ({
                id: index + 1,
                title: job.job_title,
                company: job.employer_name,
                apply_url: job.job_apply_link,
                location: `${job.job_city || ''}, ${job.job_state || ''}`.replace(/^,\s|,([^,]*)$/g, '').trim() || "Remote",
                description: job.job_description?.slice(0, 200)
            }));

            // 🔥 Step 3: Send to GROQ
            const prompt = `
Resume:
${candidateProfile.substring(0, 1500)}

Jobs:
${JSON.stringify(cleanedJobs)}

IMPORTANT:
Only use provided jobs. Map the 'apply_url' exactly from the Jobs data provided above.
Analyze and suggest best matches strictly in the JSON format requested.
Calculate 'match_score' accurately.

OUTPUT FORMAT (STRICT JSON):
{
  "candidate_summary": {
    "detected_role": "string",
    "experience_level": "string",
    "primary_skills": ["string"],
    "secondary_skills": ["string"],
    "estimated_market_value": "string"
  },
  "jobs": [
    {
      "id": "number",
      "title": "string",
      "company": "string",
      "apply_url": "string",
      "company_type": "string",
      "location": "string",
      "work_mode": "string",
      "salary_range": "string",
      "experience_required": "string",
      "posted_ago": "string",
      "applicants": "number",
      "tech_stack": ["string"],
      "key_requirements": ["string"],
      "match_score": "number",
      "match_reasoning": "string",
      "skill_overlap": ["string"],
      "skill_gaps": ["string"],
      "experience_compensated": "boolean",
      "compensation_note": "string",
      "worth_applying": "boolean",
      "worth_reasoning": "string",
      "priority": "string"
    }
  ]
}
`;
            // 🔥 Step 3: Send to GROQ for matching/scoring
            let rawContent = "";
            try {
                rawContent = await fetchFromGroq(prompt, true, false) || "";
                
                // Robust extraction: find first { and last }
                const start = rawContent.indexOf('{');
                const end = rawContent.lastIndexOf('}');
                if (start !== -1 && end !== -1) {
                    const cleanContent = rawContent.substring(start, end + 1);
                    return NextResponse.json(JSON.parse(cleanContent));
                } else {
                    throw new Error("No JSON object found in response");
                }
            } catch(e: any) {
                console.warn("[JobScout] Evaluation failed, returning raw results:", e.message);
                // 🛡️ FALLBACK: If evaluation fails, return the jobs anyway without match scores
                return NextResponse.json({
                    candidate_summary: { 
                        detected_role: finalQuery, 
                        experience_level: "Analysis pending", 
                        primary_skills: [], 
                        secondary_skills: [], 
                        estimated_market_value: "N/A" 
                    },
                    jobs: cleanedJobs.map(j => ({
                        ...j,
                        company_type: "Retrieved",
                        work_mode: "See description",
                        salary_range: "Check listing",
                        experience_required: "Check listing",
                        posted_ago: "Recently",
                        applicants: 0,
                        tech_stack: [],
                        key_requirements: [],
                        match_score: 100,
                        match_reasoning: "Showing direct results from JSearch (Evaluation currently unavailable due to high server load).",
                        skill_overlap: [],
                        skill_gaps: [],
                        worth_applying: true,
                        priority: "Normal"
                    }))
                });
            }
        }

        // ────────── ACTION: ANALYZE & GENERATE RESUME ──────────
        if (action === 'analyze') {
            const { candidateProfile, job } = body;

            if (!candidateProfile || !job) {
                return NextResponse.json({ error: 'Candidate profile and job details are required' }, { status: 400 });
            }

            const analyzePrompt = `
You are an elite Career Intelligence Agent. Generate an ATS-optimized resume tailored for a specific job.

CANDIDATE PROFILE:
"""
${candidateProfile.substring(0, 2500)}
"""

TARGET JOB:
- Title: ${job.title}
- Company: ${job.company} (${job.company_type})
- Location: ${job.location} (${job.work_mode})
- Salary: ${job.salary_range}
- Experience Required: ${job.experience_required}
- Tech Stack: ${job.tech_stack?.join(', ')}
- Key Requirements: ${job.key_requirements?.join(', ')}

OUTPUT FORMAT (STRICT JSON AND NOTHING ELSE):
{
  "deep_analysis": {
    "match_score": "number (0-100)",
    "top_strengths": ["string"],
    "critical_gaps": ["string"],
    "experience_compensation": {
      "applies": "boolean",
      "explanation": "string"
    },
    "hidden_advantages": ["string"],
    "interview_topics_to_prepare": ["string"],
    "estimated_success_rate": "string"
  },
  "tailored_resume": {
    "content": "string (full ATS-optimized resume text)"
  },
  "skill_gap_plan": {
    "critical_gaps": [
      {
        "skill": "string",
        "action": "string",
        "time_estimate": "string"
      }
    ],
    "recommended_project": {
      "title": "string",
      "description": "string",
      "skills_covered": ["string"]
    }
  },
  "application_tips": ["string"]
}
`;

            let rawContent = "";
            try {
                rawContent = await fetchFromGroq(analyzePrompt, true, false) || "";
                let cleanContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
                return NextResponse.json(JSON.parse(cleanContent));
            } catch(e) {
                console.error("GROQ JSON PARSE ERROR:", e, "Raw:", rawContent);
                throw new Error("Failed to parse standard JSON from Groq");
            }
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
