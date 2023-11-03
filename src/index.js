require('dotenv').config();
const clientWhatsapp = require("./clientWhatsapp/index");
const audioToText = require('./openai');

clientWhatsapp.on('message', async msg => {

    if (await isAudioMessageAndNotGroup(msg)) {
        const mediaMessage = await msg.downloadMedia();
        console.log(mediaMessage.data);
    }

});

const isAudioMessageAndNotGroup = async (msg) => {
    return msg.hasMedia && !(await msg.getChat()).isGroup && (msg.type == 'audio' || msg.type == 'ppt');
}

clientWhatsapp.on('message_create', async msg => {

    if (msg.body == '/toText') {
        // const textAudio = await audioToText("audio.ogg");
        await msg.reply(`*Bot:* ${"textAudio"}`);
        await msg.delete(true);
    }

});

clientWhatsapp.initialize();