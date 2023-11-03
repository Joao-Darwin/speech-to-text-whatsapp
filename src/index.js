require('dotenv').config();
const qrCode = require("qrcode-terminal");
const { Client, LocalAuth } = require('whatsapp-web.js');
const audioToText = require('./openai');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrCode.generate(qr);
});

client.on('ready', () => {
    console.log('Client is connected!');
});

client.on('message', async msg => {

    if(await isAudioMessageAndNotGroup(msg)) {
        const mediaMessage = await msg.downloadMedia();
        console.log(mediaMessage.data);
    }

});

const isAudioMessageAndNotGroup = async (msg) => {
    return msg.hasMedia && !(await msg.getChat()).isGroup && msg.type == 'AUDIO';
}

client.on('message_create', async msg => {

    if(msg.body == '/toText') {
        // const textAudio = await audioToText("audio.ogg");
        await msg.reply(`*Bot:* ${"textAudio"}`);
        await msg.delete(true);
    }

});

client.initialize();