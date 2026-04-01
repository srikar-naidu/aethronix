import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = (process.env.GROQ_API_KEY || '').trim();
        
        // Log all environment variables starting with GROQ (masked)
        Object.keys(process.env).forEach(key => {
            if (key.includes('GROQ')) {
                const val = process.env[key] || '';
                console.log(`[Env Debug] Found ${key}: length ${val.length}, starts with ${val.substring(0, 4)}`);
            }
        });

        if (!apiKey) {
            console.error('[Transcribe] GROQ_API_KEY is missing from environment variables.');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const groq = new Groq({ apiKey });

        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;
        const language = formData.get('language') as string || 'en';

        if (!audioFile) {
            console.error('[Transcribe] No audio file in formData');
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        console.log(`[Transcribe] Received file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}, language hint: ${language}`);

        if (audioFile.size < 100) {
            console.warn('[Transcribe] Audio file is suspiciously small.');
        }

        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-large-v3',
            language: language,
            response_format: 'json',
        });

        return NextResponse.json({ 
            text: transcription.text,
            debug: {
                size: audioFile.size,
                type: audioFile.type,
                name: audioFile.name,
            }
        });
    } catch (error: any) {
        console.warn('Whisper API Error:', error?.message || error);
        return NextResponse.json({ 
            error: 'Transcription failed', 
            details: error?.message || 'Unknown error'
        }, { status: error?.status || 500 });
    }
}
