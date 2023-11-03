require('dotenv').config();
const fs = require('fs');
const clientWhatsapp = require("./clientWhatsapp/index");
const audioToText = require('./openai');

clientWhatsapp.on('message', async msg => {

    if (await isAudioMessageAndNotGroup(msg)) {
        const mediaMessage = await msg.downloadMedia();

        let fileName = mediaMessage.filename ? mediaMessage.filename : "audio";

        convertBase64ToAudio(mediaMessage.data, fileName);
    }

});

const isAudioMessageAndNotGroup = async (msg) => {
    return msg.hasMedia && !(await msg.getChat()).isGroup && (msg.type == 'audio' || msg.type == 'ptt');
}

const convertBase64ToAudio = (base64Content, fileName) => {

    const binaryData = Buffer.from(base64Content, 'base64');
    const outputPath = `${__dirname}/resources/${fileName}.mp3`;

    fs.writeFile(outputPath, binaryData, 'binary', (err) => {
        if (err) {
            console.error("Erro ao salvar o arquivo de áudio:", err);
        } else {
            console.log("Arquivo de áudio salvo com sucesso em " + outputPath);
        }
    });
}

clientWhatsapp.on('message_create', async msg => {

    if (msg.body == '/toText') {
        const textAudio = await audioToText("audio.mp3");
        await msg.reply(`*Bot:* ${textAudio}`);
        await msg.delete(true);
    }

});

clientWhatsapp.initialize();