const express = require("express");
var router = express.Router();

let messageJson = { message: "サーバー動いてるよ" };

router.get("/", (req, res) => {
    res.send(messageJson);
});

router.post("/face", function (req, res) {
    res.send(`req = ${req.query.text}`);
});

module.exports = router;