require("dotenv").config();
const express = require('express');
const openai = require("./openai");

const app = express();

app.get("/test", (req, res) => {
    res.send("Hello World :)");
})

const portApplication = process.env.PORT;

app.listen(portApplication, () => {
    console.log(`Application running on port ${portApplication}!`);
    openai();
})