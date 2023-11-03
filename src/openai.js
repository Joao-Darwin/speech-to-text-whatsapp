const fs = require('fs');
const { OpenAI } = require('openai');
const path = require('path');

const openai = new OpenAI();
openai.apiKey = process.env.OPENAI_API_KEY;

export default async function main(fileName) {

    const filePath = path.join(__dirname, fileName);

    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        language: "pt"
    });

    return transcription.text;
}