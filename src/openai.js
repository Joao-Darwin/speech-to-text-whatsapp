const fs = require('fs');
const { OpenAI } = require('openai');
const path = require('path');

const openai = new OpenAI({
    organization: "org-75mbEdZ51AD9s6Qtltu57Fw7",
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

        return transcription.text;
    } catch (error) {
        console.error(error);
        return "Conversão pra texto falhou :(";
    }
}

module.exports = main;