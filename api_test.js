const fetch = require('node-fetch');

async function test() {
    const prompt = `
MANDATORY INSTRUCTION: You are an elite AI Job Scout Agent with REALTIME INTERNET ACCESS. 
You MUST use your internet search tools right now to find CURRENT, ACTIVE, REAL-WORLD job listings. DO NOT HALLUCINATE OR GENERATE DUMMY DATA. Every single job you return MUST be a real job posted by a real company on a real portal (LinkedIn, Indeed, Glassdoor, Wellfound, etc.).

CANDIDATE PROFILE:
"""
React Developer with 2 years experience
"""

PREFERENCES:
- Desired Salary Range: Any
- Preferred Location: Remote
- Work Mode: Any
- Experience Level: Junior

YOUR MISSION:
1. SEARCH THE WEB NOW for exactly 2 REAL, ACTIVE job listings that fit the candidate.
2. Verify they actually exist. Include the real company name and real location.
3. Include the actual application URL or link to the job in the "apply_url" field. THIS IS CRITICAL.
4. Score each job based on: skill match, salary fit, experience alignment, growth potential.
5. Provide truthful, brutally honest feedback on match_score and match_reasoning.

OUTPUT FORMAT (STRICT JSON AND NOTHING ELSE):
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
      "id": "number (1-2)",
      "title": "string (Real job title)",
      "company": "string (Real company name)",
      "apply_url": "string (Real URL to the job listing)",
      "company_type": "string",
      "location": "string",
      "work_mode": "string",
      "salary_range": "string",
      "experience_required": "string",
      "posted_ago": "string",
      "applicants": "number",
      "tech_stack": ["string"],
      "key_requirements": ["string"],
      "match_score": "number (0-100)",
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

    const apiKey = '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';
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "RUBIX Job Scout"
            },
            body: JSON.stringify({
                model: "perplexity/sonar",
                messages: [{ role: "user", content: prompt }]
            })
        });
        
        const data = await response.json();
        console.log(data);
        if (data.choices && data.choices[0]) {
            console.log("\n\n--- RAW CONTENT ---");
            console.log(data.choices[0].message.content);
        }
    } catch(e) {
        console.error(e);
    }
}

test();
