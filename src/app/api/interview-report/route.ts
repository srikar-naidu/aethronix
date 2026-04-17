import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = (process.env.GROQ_HIRE_API_KEY || '').trim();
        if (!apiKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const groq = new Groq({ apiKey });
        const { messages, language = 'en' } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length < 2) {
            return NextResponse.json({ error: 'Not enough interview data to generate a report' }, { status: 400 });
        }

        const prompt = `
You are an expert interview coach and hiring manager analyzing a mock interview transcript.

LANGUAGE: Respond IN ENGLISH ONLY regardless of interview language, so the report is universally readable.

INTERVIEW TRANSCRIPT:
"""
${messages.map((m: any) => `${m.role === 'assistant' ? 'Interviewer (Nexus)' : 'Candidate'}: ${m.content}`).join('\n\n')}
"""

Total questions asked: ${messages.filter((m: any) => m.role === 'assistant').length}
Total candidate responses: ${messages.filter((m: any) => m.role === 'user').length}
Interview ended: ${messages.filter((m: any) => m.role === 'user').length < 10 ? 'Early (candidate stopped midway)' : 'Completed all 10 questions'}

GENERATE A DETAILED INTERVIEW REPORT in strict JSON format:

{
  "overall_score": 0,
  "grade": "string (A+/A/B+/B/C+/C/D/F)",
  "summary": "string (2-3 sentence overall assessment)",
  "strengths": ["string (specific things the candidate did well, with examples from their answers)"],
  "weaknesses": ["string (specific areas where the candidate struggled, with examples)"],
  "question_analysis": [
    {
      "question_number": 1,
      "question": "string (the question asked)",
      "candidate_answer": "string (what they said)",
      "score": 0,
      "feedback": "string (what was good/bad about this answer)",
      "ideal_answer": "string (what a strong candidate should have said instead — be specific and actionable)"
    }
  ],
  "communication_score": 0,
  "technical_score": 0,
  "confidence_score": 0,
  "improvement_areas": [
    {
      "area": "string",
      "suggestion": "string (specific, actionable advice)"
    }
  ],
  "recommended_resources": [
    {
      "topic": "string",
      "resource": "string (specific course, book, or practice resource)"
    }
  ],
  "interview_tips": ["string (3-5 specific tips for their next interview based on what they did wrong)"],
  "hiring_recommendation": "string (Strong Hire / Hire / Maybe / No Hire — be honest based on performance)"
}

RULES:
- Score each question 0-100 based on accuracy, depth, and communication
- Overall score is a weighted average (technical 50%, communication 30%, confidence 20%)
- The ideal_answer must be SPECIFIC to the actual question asked, not generic
- If the interview ended early, note this and only analyze what was answered
- Be brutally honest but constructive
- Do NOT inflate scores

IMPORTANT: Return ONLY the JSON object. No extra text.
`;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.15,
            max_tokens: 4096,
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Interview Report API Error]:', error);
        return NextResponse.json({
            error: 'Failed to generate interview report',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}
