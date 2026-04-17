import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = (process.env.GROQ_ROADMAP_API_KEY || '').trim();
        
        if (!apiKey) {
            console.error('[RoadmapDocs] GROQ_ROADMAP_API_KEY is missing.');
            return NextResponse.json({ error: 'Roadmap documentation service is unconfigured.' }, { status: 500 });
        }

        const { domain, phaseTitle, phaseDescription, language = 'en' } = await req.json();

        if (!domain || !phaseTitle) {
            return NextResponse.json({ error: 'Missing domain or phase information' }, { status: 400 });
        }

        const groq = new Groq({ apiKey });

        const languageMap: Record<string, string> = {
            en: 'English',
            hi: 'Hindi (हिन्दी)',
            te: 'Telugu (తెలుగు)',
            ta: 'Tamil (தமிழ்)',
            kn: 'Kannada (ಕನ್ನಡ)',
            bn: 'Bengali (বাংলা)',
            gu: 'Gujarati (ગુજરાતી)',
            mr: 'Marathi (मराठी)'
        };

        const targetLanguage = languageMap[language] || 'English';

        const prompt = `You are a Senior Engineer specializing in ${domain}.
Provide a structured "Mastery Pack" for this learning phase in ${targetLanguage}.

**Phase:** ${phaseTitle}
**Context:** ${phaseDescription}

**You MUST return ONLY a valid JSON object with this exact structure:**
{
  "summary": "A 1-2 sentence high-level overview of why this phase is crucial.",
  "checklist": ["Task 1", "Task 2", "Task 3", "Task 4"],
  "industryInsight": "One elite sentence on how top companies (FAANG/OpenAI) use this in 2026.",
  "tooling": [
    {"name": "ToolName", "purpose": "Short purpose"},
    {"name": "ToolName", "purpose": "Short purpose"}
  ],
  "interview": {
    "question": "One high-impact technical interview question.",
    "answer": "A concise, 'Senior-level' sample answer."
  }
}

**CRITICAL: Use ONLY ${targetLanguage} for all values.**
**CRITICAL: NO Markdown formatting, NO quotes outside JSON, NO conversational text.**`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a career-focused technical documentation engine.' },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.5,
            max_tokens: 1000,
            response_format: { type: "json_object" },
            top_p: 1,
            stream: false,
        });

        const generatedText = chatCompletion.choices[0]?.message?.content || 'Failed to generate documentation.';

        return NextResponse.json({ 
            content: generatedText,
            domain,
            phaseTitle
        });
    } catch (error: any) {
        console.warn('Roadmap Generation Error:', error?.message || error);
        return NextResponse.json({ 
            error: 'AI Generation failed', 
            details: error?.message || 'Unknown error'
        }, { status: error?.status || 500 });
    }
}
