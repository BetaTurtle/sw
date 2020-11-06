const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const { Telegraf } = require('telegraf')
const bot = new Telegraf(functions.config().bot.token)

exports.documentCreate = functions.firestore
    .document('orders/{documentId}')
    .onCreate((change, context) => {
        const docId = context.params.documentId
        bot.telegram.sendMessage(functions.config().bot.chat, '🛒 New order placed:\nhttps://safewaydelivery.in/orders/#' + docId);
    });