import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_VERIFY_API_KEY;
        const groq = new Groq({ apiKey });

        const { domainId } = await req.json();

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an elite technical interviewer. Generate a personalized assessment quiz for the domain: ${domainId}. 
Respond ONLY with a valid JSON object. No markdown, no extra text. 

The JSON must have this exact structure:
{
  "mcqs": [
    {
      "question": "Clear, highly technical question about ${domainId}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this answer is correct."
    }
  ]
}

**Requirements:**
1. Generate exactly 5 questions.
2. Ensure questions are challenging (Senior level).
3. Cover diverse topics within the ${domainId} domain.
4. All values must be in English unless technical terms in the target domain require otherwise.`
                },
                {
                    role: 'user',
                    content: `Generate a 5-question elite technical quiz for ${domainId}.`
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1500,
            response_format: { type: "json_object" },
        });

        const raw = completion.choices[0]?.message?.content || '';
        return new NextResponse(raw, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('MCQ Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
    }
}
