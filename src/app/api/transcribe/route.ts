import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        const groq = new Groq({ apiKey });

        const formData = await req.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-large-v3',
            language: 'en',
            response_format: 'json',
        });

        return NextResponse.json({ text: transcription.text });
    } catch (error: any) {
        console.warn('Whisper API Error:', error?.message || error);
        return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
    }
}
