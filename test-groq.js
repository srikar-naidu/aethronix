const Groq = require('groq-sdk');

const apiKey = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey });

async function main() {
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [{ "role": "user", "content": "Explain the importance of low latency LLMs." }],
            "model": "llama-3.1-8b-instant",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });
        console.log("SUCCESS");
        console.log(chatCompletion.choices[0]?.message?.content || "");
    } catch (err) {
        console.error("ERROR from Groq:", err.status || err.message, err);
    }
}

main();
