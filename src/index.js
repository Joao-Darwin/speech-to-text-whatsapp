require('dotenv').config();
const fs = require('fs');
const clientWhatsapp = require("./clientWhatsapp/index");
const audioToText = require('./openai');

const groupBotName = process.env.GROUP_BOT_NAME;
const phoneNumberToSendMessage = process.env.YOUR_PHONE_NUMBER;

clientWhatsapp.on('message', async msg => {

    if (await isAudioMessageValid(msg)) {
        const mediaMessage = await msg.downloadMedia();

        let fileName = mediaMessage.filename ? mediaMessage.filename : "audio";

        convertBase64ToAudio(mediaMessage.data, fileName);
    }

});

const isAudioMessageValid = async (msg) => {
    return msg.hasMedia && await isNotFromGroup(msg) && await isMessageTypeValid(msg);
}

const isNotFromGroup = async (msg) => {
    return !(await msg.getChat()).isGroup
}

const isMessageTypeValid = async (msg) => {
    return (msg.type == 'audio' || msg.type == 'ptt')
}

const convertBase64ToAudio = (base64Content, fileName) => {

    const binaryData = Buffer.from(base64Content, 'base64');
    const outputPath = `${__dirname}/resources/${fileName}.ogg`;

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
        let contactSendAudio = await clientWhatsapp.getContactById(msg.to);
        const nameContactSentMessage = contactSendAudio.name;

        const textAudio = await audioToText("audio.ogg");

        await sendMessageOnGroup(textAudio, nameContactSentMessage);
        await msg.delete(true);
    }

});

const sendMessageOnGroup = async (msg, contactSentMessage) => {

    let chats = await clientWhatsapp.getChats();

    let findGroupBot = false;
    let chatGroupBot;

    chats.map((chat) => {
        if (chat.isGroup && chat.name === groupBotName) {
            chatGroupBot = chat;
            findGroupBot = true;
        }
    })

    if(findGroupBot) {
        chatGroupBot.sendMessage(`*🤖 Bot*\n*Áudio de ${contactSentMessage}:*\n${msg}`);
    } else {
        const contact = await getContactYourself();
        await clientWhatsapp.createGroup(groupBotName, contact);
    }
}

const getContactYourself = async () => {
    const contacts = await clientWhatsapp.getContacts();

    contacts.map((contact) => {
        if (contact.number === phoneNumberToSendMessage) {
            return contact;
        }
    })
}

clientWhatsapp.initialize();