const express = require("express");
require('dotenv').config();
console.log(require('dotenv').config());
var router = express.Router();

router.get("/", (req, res) => {
    res.send({ message: "サーバー動いてるよ" });
});

router.post("/face", function (req, res) {
    // const image = req.query.faceimage;
    // const uid = req.query.uid;

    //faceAPIの処理かく
    //uid使ってFirestore参照&感情数値保存!

    res.send({res: "Success!"});
});

module.exports = router;