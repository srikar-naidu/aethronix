import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_VERIFY_API_KEY;
        const groq = new Groq({ apiKey });

        const { domain, results } = await req.json();

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an elite Senior Staff Engineer and Technical Mentor. 
Your task is to provide a "Too Good" analysis and report based on a user's technical assessment in the domain: ${domain}.

**Input Data:**
Assessments Results (Questions, User Answers, Correct Answers, Explanations).

**Requirements:**
1. Provide a "Mastery Analysis" (Overall feedback).
2. For EACH question, provide a deep dive including:
   - "Why you were right/wrong".
   - "Documentation Link": A TRIPLE-CHECKED, REAL link to official documentation (MDN, React Docs, Node Docs, etc.) related to that question's topic.
3. Identify "Critical Skills Lacking": A list of 3-5 specific topics they should study next.
4. Final Verdict: Use high-end, professional terminology.

**Respond ONLY with a valid JSON object:**
{
  "summary": "Elite professional feedback...",
  "breakdown": [
    {
      "question": "...",
      "isCorrect": true/false,
      "feedback": "Deep technical insight on why this concept matters...",
      "docsLink": "https://developer.mozilla.org/..." 
    }
  ],
  "lackingSkills": ["Skill 1", "Skill 2"],
  "verdict": "Distinguished Specialist / Needs Refinement / etc."
}`
                },
                {
                    role: 'user',
                    content: `Please analyze my ${domain} assessment results: ${JSON.stringify(results)}`
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
            max_tokens: 1500,
            response_format: { type: "json_object" }
        });

        const raw = completion.choices[0]?.message?.content || '{}';
        return new NextResponse(raw, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Report Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate assessment report' }, { status: 500 });
    }
}
