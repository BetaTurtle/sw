const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const { Telegraf } = require('telegraf')
const extra = require('telegraf/extra')
const markup = extra.markdown()
const bot = new Telegraf(functions.config().bot.token)

exports.documentCreate = functions.firestore
    .document('orders/{documentId}')
    .onCreate((change, context) => {
        const docId = context.params.documentId
        var message = '🛒 New order received' + '\nhttps://safewaydelivery.in/orders/#' + docId + "\n\n";
        var content = "*Name: *" + change.data().name +
            "\n*Phone: *" + change.data().phone +
            "\n*Address: *" + change.data().address +
            "\n*PIN: *" + change.data().zip +
            "\n*Note: *" + change.data().order_note +
            "\n*Items: *\n";
        for (var i in change.data().items) {
            content += change.data().items[i].product_name + " × " + change.data().items[i].product_quantity + "\n"
        }
        content += "\n*Delivery charge:* ₹" + int(+change.data().extra_charge);
        content += "\n*Total: " + change.data().total + "*";
        bot.telegram.sendMessage(functions.config().bot.chat, message + content, markup);
    });