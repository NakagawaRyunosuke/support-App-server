const express = require("express");
require('dotenv').config();
console.log(require('dotenv').config());
var router = express.Router();

router.get("/", (req, res) => {
    res.send({ message: "サーバー動いてるよ" });
});

router.post("/api_test", function (req, res) {
    // const image = req.query.faceimage;
    // const uid = req.query.uid;

    //faceAPIの処理かく
    //uid使ってFirestore参照&感情数値保存!
    const appId = process.env.APP_ID
    const firebaseApiKey = process.env.FIREBASE_API_KEY
    const faceApiKey = process.env.FACE_API_KEY
    
    // FACE_API_KEY
    res.send({
    res: "Success!",
    face_api_key: face_api_key,
    });
});

router.post("/face", function (req, res) {
    // const image = req.query.faceimage;
    // const uid = req.query.uid;

    const axios = require('axios');
    const fs = require('fs');

    // Face APIのエンドポイントとキーを設定します
    const faceApiEndpoint = `https://${process.env.REGION}.api.cognitive.microsoft.com/face/v1.0/detect`;
    const faceApiKey = process.env.FACE_API_KEY;

    // 感情を推定したい画像のファイルパスを設定します
    // その後､image変数を利用
    const imagePath = 'IMG_4163.jpeg';

    // 画像ファイルをバイナリデータとして読み込みます
    const imageBuffer = fs.readFileSync(imagePath);

    // Face APIに送信するヘッダーを設定します
    const headers = {
    'Content-Type': 'application/octet-json',
    'Ocp-Apim-Subscription-Key': faceApiKey
    };

    // Face APIを呼び出します
    axios({
    method: 'post',
    url: faceApiEndpoint,
    data: imageBuffer,
    headers: headers,
    params: {
        returnFaceId: 'true',
        returnFaceLandmarks: 'false',
        returnFaceAttributes: 'emotion',
    },
    })
    .then(response => {
    // Face APIから返された感情スコアを表示します
    // const emotions = response.data[0].faceAttributes.emotion;
    // console.log(emotions);
        res.send({
        res: "Success!",
        emotions: response.data[0].faceAttributes.emotion,
        http_code: response.status
        });
    })
    .catch(error => {
        res.send({
        res: "Error!",
        faceApiEndpoint:faceApiEndpoint,
        faceApiKey: faceApiKey,
        http_code: error.response.status
        });
    });
});

module.exports = router;