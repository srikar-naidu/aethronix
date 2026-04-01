import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        // Force use the exact string provided by the user without any .env whitespace bugs
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("GROQ_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // Initialize Groq client
        const groq = new Groq({
            apiKey: apiKey,
        });

        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are Nexus, a friendly, concise, and dynamic technical lead engineer conducting an interview.\n1. Listen to whatever the candidate says. Analyze their input to understand their background, field, or skills. If they mention any technologies or domains (e.g., React, Python, Data Science, Backend), base your questions on that. If they give a general answer, ask general software engineering or behavioral questions.\n2. Ask exactly 10 interview questions tailored to their responses, ONE at a time.\n3. After the candidate answers a question, provide a brief 1-sentence feedback/analysis of their answer, announce the next question (e.g. "Question 2 of 10:"), and ask the new question.\n4. When 10 questions have been asked and answered, conclude the interview gracefully.\nKeep all your responses completely under 4 sentences so they can be spoken via Text-To-Speech. Never break character.'
                },
                ...messages
            ],
            model: 'llama-3.1-8b-instant', // Fast model for real-time interaction
            temperature: 0.7,
            max_tokens: 150,
            stream: false,
        });

        const aiMessage = completion.choices[0]?.message?.content || 'I encountered an error. Let\'s continue.';

        return NextResponse.json({ message: aiMessage });

    } catch (error) {
        console.error('Groq API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
