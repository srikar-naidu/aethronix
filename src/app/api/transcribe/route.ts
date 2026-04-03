import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = (process.env.GROQ_HIRE_API_KEY || '').trim();
        if (!apiKey) {
            console.error('[Transcribe API] GROQ_HIRE_API_KEY is missing.');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const groq = new Groq({ apiKey });

        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;
        const language = formData.get('language') as string || 'en';

        if (!audioFile) {
            console.error('[Transcribe API] No audio file in formData');
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        // 1. ArrayBuffer extraction for SDK compatibility
        console.time('[Transcribe API Process]');
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (buffer.length < 500) {
            console.warn('[Transcribe API] Buffer too small:', buffer.length);
            return NextResponse.json({ error: 'Audio too short', details: 'Speak for at least 3 seconds.' }, { status: 400 });
        }

        // 2. Perform Transcription using Whisper-large-v3
        // Switched to groq.toFile() - the SDK's native and most robust buffer handling method.
        const transcription = await groq.audio.transcriptions.create({
            file: await Groq.toFile(buffer, 'recording.webm', { type: 'audio/webm' }),
            model: 'whisper-large-v3',
            language: language,
            response_format: 'json',
            temperature: 0.0,
        });

        console.timeEnd('[Transcribe API Process]');
        const text = transcription.text || '';
        
        return NextResponse.json({ text });

    } catch (error: any) {
        console.error('[Transcribe API Detailed Error]:', {
            message: error?.message,
            status: error?.status,
            name: error?.name,
            details: error?.details || 'No extended details'
        });
        
        if (error?.status === 401 || error?.message?.includes('key')) {
            return NextResponse.json({ error: 'Authentication Error', details: 'Invalid API Key configuration.' }, { status: 500 });
        }

        return NextResponse.json({ 
            error: 'Transcription failed', 
            details: error?.message || 'The AI was unable to hear clearly. Please speak closer to the microphone and try again.'
        }, { status: 500 });
    }
}
