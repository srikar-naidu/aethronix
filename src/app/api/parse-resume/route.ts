import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = (process.env.GROQ_RESUME_API_KEY || '').trim();
        if (!apiKey) {
            return NextResponse.json({ error: 'Server configuration error: missing GROQ API Key' }, { status: 500 });
        }

        const groq = new Groq({ apiKey });

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const language = (formData.get('language') as string) || 'en';

        if (!file) {
            return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
        }

        // 1. Extract text from the uploaded .txt file
        const extractedText = await file.text();

        console.log('[Resume Parser] Extracted Text Length:', extractedText?.length);
        if (extractedText) {
            console.log('[Resume Parser] Preview:', extractedText.substring(0, 300).replace(/\n/g, ' '));
        }

        if (!extractedText || extractedText.trim().length < 20) {
            return NextResponse.json({ 
                error: 'The uploaded file is empty or contains no readable text.',
                details: 'Please ensure you are uploading a valid .txt file.'
            }, { status: 400 });
        }

        // 2. Use Groq to parse into structured JSON
        const prompt = `
        You are an expert Talent Acquisition AI specializing in rural skill development for the SkillBridge AI platform.
        Extract detailed information from the following resume text and format it as a valid JSON object.
        The user's preferred language for analysis is: ${language}.
        Perform all analysis and provide the final JSON in ${language}.

        JSON Schema:
        {
          "personalInfo": {
            "name": "string",
            "email": "string",
            "contact": "string"
          },
          "skills": {
            "technical": ["string"],
            "soft": ["string"]
          },
          "experience": [
            {
              "role": "string",
              "company": "string",
              "duration": "string",
              "impact": "string (one sentence summary of key achievement)"
            }
          ],
          "readinessScore": number (0 to 100, based on market standards for current skills),
          "analysisSummary": "string (2 sentences summarizing their profile in ${language})",
          "missingSkills": ["string (key industry skills they are missing based on their profile)"]
        }

        Resume Text:
        """
        ${extractedText}
        """

        IMPORTANT: Return ONLY the JSON object. No other text.
        `;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.1,
        });

        const parsedResult = JSON.parse(completion.choices[0].message.content || '{}');

        return NextResponse.json(parsedResult);
    } catch (error: any) {
        console.error('[Resume Parser API General Error]:', error);
        return NextResponse.json({ 
            error: 'Failed to parse resume', 
            details: error?.message || 'Unknown error',
            hint: 'Ensure the file is a valid .txt document containing readable text.'
        }, { status: 500 });
    }
}
