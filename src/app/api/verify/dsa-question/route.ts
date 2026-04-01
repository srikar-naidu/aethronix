import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        const groq = new Groq({ apiKey });

        const { topic, difficulty } = await req.json();

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a DSA problem generator. Generate a single realistic coding problem. Respond ONLY with valid JSON, no markdown, no extra text. The JSON must have this exact structure:
{
  "title": "Problem Title",
  "difficulty": "${difficulty || 'Medium'}",
  "topic": "${topic || 'Arrays'}",
  "description": "Full problem description with clear explanation",
  "constraints": ["constraint 1", "constraint 2", "constraint 3"],
  "examples": ["Input: nums = [2,7,11,15], target = 9\\nOutput: [0,1]\\nExplanation: Because nums[0] + nums[1] == 9", "Input: nums = [3,2,4], target = 6\\nOutput: [1,2]"]
}`
                },
                {
                    role: 'user',
                    content: `Generate a ${difficulty || 'Medium'} difficulty ${topic || 'Arrays'} problem.`
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.8,
            max_tokens: 800,
            stream: false,
        });

        const raw = completion.choices[0]?.message?.content || '';

        // Try to parse JSON from the response
        let problem;
        try {
            // Extract JSON from response (handle cases where model adds text around it)
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            problem = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch {
            problem = null;
        }

        if (!problem) {
            // Fallback problem
            problem = {
                title: "Two Sum",
                difficulty: difficulty || "Medium",
                topic: topic || "Arrays",
                description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
                constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
                examples: ["Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].", "Input: nums = [3,2,4], target = 6\nOutput: [1,2]"]
            };
        }

        return NextResponse.json(problem);
    } catch (error: any) {
        console.warn('DSA Question Generation Error:', error?.message || error);
        return NextResponse.json({
            title: "Two Sum",
            difficulty: "Medium",
            topic: "Arrays",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
            examples: ["Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"]
        });
    }
}
