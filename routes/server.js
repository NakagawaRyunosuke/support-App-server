const express = require("express");
var router = express.Router();

let messageJson = { message: "Hello Flutter!" };

router.get("/message", (req, res) => {
    res.send(messageJson);
});

module.exports = router;