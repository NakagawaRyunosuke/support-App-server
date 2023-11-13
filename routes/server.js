const express = require("express");
var router = express.Router();

let messageJson = { message: "サーバー動いてるよ" };

router.get("/", (req, res) => {
    res.send(messageJson);
});

router.get("/test", (req, res) => {
    res.send(`${process.env.TEST}`);
});

router.post("/face", function (req, res) {
    // const image = req.query.faceimage;
    // const uid = req.query.uid;

    //faceAPIの処理かく
    //uid使ってFirestore参照&感情数値保存!

    res.send({res: "Success!"});
});

module.exports = router;