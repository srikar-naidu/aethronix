import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_VERIFY_API_KEY;
        const groq = new Groq({ apiKey });

        const { problem, code, language } = await req.json();

        const prompt = `You are a Strict Adversarial Technical Judge.
Your sole purpose is to ruthlessly verify the correctness of the code against the provided problem and hidden test cases.

**Rules for Judging:**
1. **Zero Tolerance**: If the code fails even ONE hidden test case, the "correctness" score MUST be below 40%.
2. **Mental Execution**: Execute the code line-by-line for each hidden test case. 
3. **Output Matching**: The output MUST match the "expected" value exactly. If it differs by even a character (unless trivial whitespace), it is a FAIL.
4. **Logic Integrity**: Detect and penalize 'Cheating' or 'Hardcoding' (e.g., 'if (input == x) return y'). If the code doesn't solve the *general* problem, fail it as 'Logic Fraud'.
5. **No Assumptions**: Do not guess if the user meant to do something correctly. Judge the code as it is written.

**Problem:**
${problem.title}
${problem.description}

**User Code (${language}):**
\`\`\`${language}
${code}
\`\`\`

**Hidden Test Cases:**
${JSON.stringify(problem.testCases, null, 2)}

**Required JSON Format Storecard (Return ONLY raw JSON):**
{
  "overallScore": 0-100,
  "correctness": 0-100,
  "edgeCases": 0-100,
  "timeComplexity": "string",
  "spaceComplexity": "string",
  "percentile": 0-100,
  "optimizations": ["list"],
  "testCaseResults": [
    {"input": "in", "output": "out", "expected": "exp", "passed": boolean}
  ],
  "verdict": "Clear concise judge verdict (e.g. 'Failed due to logic flaw in Case 3')",
  "passedAll": boolean
}`;

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
