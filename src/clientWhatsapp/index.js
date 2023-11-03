const qrCode = require("qrcode-terminal");
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrCode.generate(qr);
});

client.on('ready', () => {
    console.log('Client is connected!');
});

module.exports = client;