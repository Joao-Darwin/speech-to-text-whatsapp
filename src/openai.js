const fs = require('fs');
const { OpenAI } = require('openai');
const path = require('path');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main(fileName) {

    const filePath = path.join(__dirname + "/resources/", fileName);

    try {

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
            language: "pt",
            response_format: "text"
        });

        return transcription;
    } catch (error) {
        console.error(error);
        return "Conversão pra texto falhou :(";
    }
}

module.exports = main;