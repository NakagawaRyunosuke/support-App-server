const express = require("express");

const app = express();
let messageJson = { message: "Hello Flutter!" };

app.use(express.json());

app.get("/message", (req, res) => {
    res.send(messageJson);
});

app.listen(8000, () => {
    console.log("running...");
});