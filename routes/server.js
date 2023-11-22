const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');
const express = require("express");
require('dotenv').config();
var router = express.Router();
const axios = require('axios');

// Initialize Firebase
const firebaseServiceAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN,
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// const serviceAccount = firebaseServiceAccount;
const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

//受け取った画像URLをもとに感情データ取得
async function imageAnalys(imageURL){
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
            source: {
              imageUri: imageURL
            }
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
        const emotionData = {
          "joyLikelihood": responses[0]["faceAnnotations"][0]["joyLikelihood"],
          "sorrowLikelihood": responses[0]["faceAnnotations"][0]["sorrowLikelihood"],
          "angerLikelihood": responses[0]["faceAnnotations"][0]["angerLikelihood"],
          "surpriseLikelihood": responses[0]["faceAnnotations"][0]["surpriseLikelihood"],
        }
        return emotionData;
      }
    } catch (error) {
      console.error(error.response || error);
    }
}

async function setDiaryData(uid, emotionResult, imageURL, voiceURL, voiceText){
  try{
    const docRef = db.collection('Users').doc(uid).collection("Diary");
    await docRef.add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      emotionResult: emotionResult,
      imageURL: imageURL,
      voiceURL: voiceURL,
      voiceText: voiceText
    });
  }catch(e){
    console.error('Error adding document: ', e);
  }
}

router.get("/", (req, res) => {
  res.send({ message: "サーバー動いてるよ"});
});

router.post("/diary", async function (req, res) {
  const imageURL = req.body.imageURL; //画像のURLもらう
  //const voiceURL = req.body.voiceURL; //音声のURLもらう
  //const voiceText = req.body.voiceText; //音声文字起こしテキストもらう
  const uid = req.body.uid; //uidもらう
  const voiceURL = "Users/<uid>/voice.m4a"; 
  const voiceText = "おはよう、今日は寒くて関節が痛いです。最近は綺麗な花を見つけたので散歩も楽しいです"; 

  const emotionResult = await imageAnalys(imageURL); // APIにbase64文字列を渡し、結果をレスポンスで返却してます
  setDiaryData(uid, emotionResult, imageURL, voiceURL, voiceText);  // uid使ってFirestoreのサブコレクション(Diary)に保存
  
  res.send("Success!");
});

module.exports = router;