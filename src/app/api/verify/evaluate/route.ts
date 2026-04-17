import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_VERIFY_API_KEY;
        const groq = new Groq({ apiKey });

        const { problem, code, language } = await req.json();

        const prompt = `You are a High-Performance Code Execution Engine and Technical Judge.
Your task is to evaluate the provided code against the problem description and hidden test cases. 

**Programming Language:** ${language}

**Problem:**
${problem.title}
${problem.description}

**User Code:**
\`\`\`${language}
${code}
\`\`\`

**Hidden Test Cases to Verify:**
${JSON.stringify(problem.testCases, null, 2)}

**Evaluation Instructions:**
1. Mentally execute the code for EACH hidden test case.
2. Determine if the output matches the expected output.
3. Analyze time and space complexity based on the logic used.
4. Check for edge cases, null handling, and language-specific best practices.

**You MUST respond ONLY with a valid JSON scorecard:**
{
  "overallScore": 85, (0-100)
  "correctness": 90, (0-100)
  "edgeCases": 80, (0-100)
  "timeComplexity": "O(n log n) - Efficient sorting approach",
  "spaceComplexity": "O(n) - Additional storage used for hash map",
  "percentile": 92, (Randomized elite ranking based on quality)
  "optimizations": ["Consider using two pointers instead of a map", "Handle empty array input"],
  "testCaseResults": [
    {"input": "...", "output": "actual result", "expected": "...", "passed": true}
  ]
}

**CRITICAL: DO NOT add markdown triple backticks. RETURN ONLY RAW JSON.**`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: "You are a code execution engine. You verify logic and return results in valid JSON." },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.1-70b-versatile',
            temperature: 0.1, // Low temperature for high precision
            max_tokens: 1500,
            response_format: { type: "json_object" }
        });

        const raw = completion.choices[0]?.message?.content || '{}';
        return new NextResponse(raw, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('AI-Judge Evaluation Error:', error);
        return NextResponse.json({ error: 'Evaluation system failure' }, { status: 500 });
    }
}
