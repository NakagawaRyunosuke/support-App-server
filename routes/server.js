const express = require("express");
require('dotenv').config();
var router = express.Router();
const axios = require('axios');

async function imageAnalys(imageData){
    const apiKey = process.env.VISION_API_KEY;
    const apiEndpoint = process.env.VISION_API_ENDPOINT;
    const visionApiUrl = `${apiEndpoint}?key=${apiKey}`
    if (!apiKey) {
        console.log("Env 'VISION_API_KEY' must be set.");
        process.exit(1);
    }

    const options = {
        requests: [
          {
            image: {
              content: imageData,
            },
            features: [
              {
                type: "FACE_DETECTION",
                maxResults: 1,
              },
            ],
          },
        ],
    };

    try {
        const result = await axios.post(visionApiUrl, options);
        console.log("Request success!");
    
        if (result.data && result.data.responses) {
          const responses = result.data.responses;
    
          responses.forEach((response) => {
            console.log("Face:");
            response.landmarkAnnotations.forEach((annotation) =>
              console.log(annotation)
            );
          });
        }
    } catch (error) {
        console.error(error.response || error);
    }
    
}

router.get("/", (req, res) => {
    res.send({ message: "サーバー動いてるよ" });
    imageAnalys();
});

router.post("/face", function (req, res) {
    const imageData = req.query.faceimage; //画像のbase64変換した文字列をもらう
    //const uid = req.query.uid;

    // Cloud Vision APIの処理かく
    // APIにbase64文字列を渡す&optionで表情分析を指定する
    imageAnalys(imageData);

    // uid使ってFirestoreのサブコレクション(体調データ)にbase64文字列を保存&感情情報!
});

module.exports = router;