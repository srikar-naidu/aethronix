const Groq = require('groq-sdk');
const fs = require('fs');

const apiKey = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey });

async function main() {
    try {
        console.log("Testing Transcription with key length:", apiKey?.length);
        // We need a small audio file to test. Let's see if we can use any file and hope Whisper accepts or errors correctly.
        // Actually, let's just make sure we are not getting 401.
        
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream('test-groq.js'), // Dummy file to check auth
            model: 'whisper-large-v3',
        });
        console.log("SUCCESS");
        console.log(transcription.text);
    } catch (err) {
        console.error("ERROR from Groq:", err.status || err.message, JSON.stringify(err.error || err));
    }
}

main();
