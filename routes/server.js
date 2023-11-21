const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');
require('dotenv').config();
// Initialize Firebase

// const firebaseServiceAccount = {
//     "type": process.env.TYPE,
//     "project_id": process.env.PROJECT_ID,
//     "private_key_id": process.env.PRIVATE_KEY_ID,
//     "private_key": process.env.PRIVATE_KEY,
//     "client_email": process.env.CLIENT_EMAIL,
//     "client_id": process.env.CLIENT_ID,
//     "auth_uri": process.env.AUTH_URI,
//     "token_uri": process.env.TOKEN_URI,
//     "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_CERT_URL,
//     "client_x509_cert_url": process.env.CLIENT_CERT_URL,
//     "universe_domain": process.env.UNIVERSE_DOMAIN,
// }

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// const serviceAccount = firebaseServiceAccount;
// const app = initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();

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
            return responses[0];
        }
    } catch (error) {
        console.error(error.response || error);
    }
}

router.get("/", (req, res) => {
    res.send({ message: "サーバー動いてるよ"});
});

router.post("/face", function (req, res) {
    const imageData = req.body.imageData; //画像のbase64変換した文字列をもらう
    //const uid = req.query.uid;

    // Cloud Vision APIの処理かく
    // APIにbase64文字列を渡し、結果をレスポンスで返却してます
    imageAnalys(imageData).then((value) => {
      const resData = JSON.stringify(value, null, 4);
      res.send(`結果:${resData}`);
    });

    // uid使ってFirestoreのサブコレクション(体調データ)にbase64文字列を保存&感情情報!
});

async function setImageResult(uid,emotionResult){
  try{
    const docRef = db.collection('Users').doc(uid).collection("Image");
    const result = await docRef.add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      emotionResult: emotionResult,
    });
  }catch(e){
    console.error('Error adding document: ', e);
  }
}

async function getImageUrl(uid){
  try{
    const docRef = db.collection('Users').doc(uid);
    const doc = await docRef.get();

    if (doc.exists) {
      const imageUrl = doc.data().imageUrl;
      return imageUrl;
    } else {
      console.log('No such document!');
      return null;
    }
  }catch(e){
    console.error('Error getting document:', e);
    return null;
  }
}

router.post("/test",async function(req,res){
    const imageData = req.body.imageData;
    const uid = req.body.uid;
    // APIにbase64文字列を渡し、結果をレスポンスで返却してます
    imageAnalys(imageData).then((value) => {
      const resData = JSON.stringify(value, null, 4);
      setImageResult(uid, resData);
      res.send(`結果:${resData}`);
    });
});

module.exports = router;