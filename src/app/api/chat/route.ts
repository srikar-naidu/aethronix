import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = (process.env.GROQ_HIRE_API_KEY || '').trim();
        if (!apiKey) {
            console.error("[Chat API] GROQ_HIRE_API_KEY is missing.");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const groq = new Groq({ apiKey });

        const { messages, language = 'en' } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || "";

        // Refined System Prompt for better technical reasoning and multilingual support
        const systemPrompt = `
        You are Nexus, a brilliant, friendly, and concise Lead Engineer conducting a skill-first technical interview for the RUBIX AI platform.
        
        Your Mission:
        1. Contextual Interviewing: Analyze the candidate's last response: "${lastUserMessage}". 
        2. Field Alignment: If they mention specific skills (e.g., React, Java, Agriculture, Sales), tailor your next question to that field.
        3. Multilingual Excellence: The user's preferred language is ${language}. You MUST respond in ${language}.
        4. Structured Interaction:
           - Provide a 1-sentence supportive feedback on their previous answer.
           - Ask exactly ONE follow-up technical or behavioral question.
           - State the question number (e.g., "Question 2 of 10").
        5. Voice-Ready: Keep your entire response under 3 sentences for perfect Text-To-Speech playback. 
        6. Interview Limit: Stop and conclude professionally after 10 questions.
        
        CRITICAL: Never include any speaker labels or prefixes like "Nexus:", "Assistant:", or "You:". Only output the direct speech.
        Never break character. Never use bold text or markdown that might confuse TTS.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile', // Upgraded for much better reasoning
            temperature: 0.6,
            max_tokens: 250,
        });

        let aiMessage = completion.choices[0]?.message?.content || 'I encountered a brief connection error. Let\'s continue.';

        // Robust multi-pass cleanup for common AI-prefixed labels (bolded, after newlines, scripted dialogue)
        const roleLabelRegex = /^(\*\*|)(Nexus|Assistant|AI|Interviewer|You|User|Nexus \(AI\))(\*\*|):\s*/gmi;
        aiMessage = aiMessage.replace(roleLabelRegex, '').trim();

        return NextResponse.json({ message: aiMessage });

    } catch (error: any) {
        console.error('[Chat API Error]:', error);
        return NextResponse.json({ 
            error: 'Failed to generate interviewer response',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}
