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

        const prompt = `You are an Expert Career Mentor and Senior Engineer specializing in ${domain}.
Provide a highly detailed, technical, and actionable deep-dive for the following learning phase.

**IMPORTANT: You MUST provide the entire response in ${targetLanguage}.**
**CRITICAL: Do NOT include English technical terms in brackets. Use the appropriate technical terminology directly in the target language script.**

**Domain:** ${domain}
**Phase:** ${phaseTitle}
**Current Description:** ${phaseDescription}

Your documentation must be extremely comprehensive and follow this structure:
1. **Core Technical Concepts**: Explained with high granularity.
2. **2026 Industry Implementation Standards**: How top-tier companies (FAANG/OpenAI/High-growth startups) currently use this.
3. **Step-by-Step Practical Roadmap**: 5-7 highly specific sub-tasks to master this phase.
4. **Deep-Dive Tooling**: Specific libraries, versions, and configurations to explore.
5. **Interview Blueprint**: 3 advanced technical interview questions related to this phase, with sample high-quality answers.

Formatting requirements:
- Use clean Markdown.
- Use bold headers.
- Use bullet points for readability.
- Avoid generic filler text.
- Keep the tone professional, encouraging, and elite.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a career-focused technical documentation engine.' },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2000,
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
