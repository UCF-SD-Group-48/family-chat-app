// another example function

// const functions = require("firebase-functions");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { ExpoPushMessage } =  require('expo-server-sdk');
const { Expo } = require('expo-server-sdk');
// const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();


// example function
// // Take the text parameter passed to this HTTP endpoint and insert it into 
// // Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     const writeResult = await admin.firestore().collection('messages').add({original: original});
//     // Send back a message that we've successfully written the message
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
// });



//pass in a list of messages
// example: [
//     {"to":"ExponentPushToken[rEhLFwBuiwPQ7PFfeOH0HT]",
//     "sound":"default",
//     "title":"Freddy sent a message in \"General\"",
//     "body":"Test",
//     "data":{"url":"familychat://chat/P7o2KPs5LLzv4YGf1LwA/General/2g68B8ueZ8BK4UByDywd/Jackson Household/ij0T9Wp64ThYxOXvRi9Hr240KWJ3/green/3/1652311167"}}  ]
//pass in a an array where each index is a map from expo tokens to user UIDs
//example: [
    // {"ExponentPushToken[abc]":"aPP69WhSvWTkFMMDwa6Py8u72Dx2"},
    // {"ExponentPushToken[sJbR9ALTkwLe4O6mhjdJrl]":"lbW5X7eNVBhhBP4dH61F92taVT73"}  ]
exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
    
    // get the data from the function
    let messages = JSON.parse(req.query.messages);
    let users = JSON.parse(req.query.users);
        // users[0]["ExponentPushToken[rEhLFwBuiwPQ7PFfeOH0HT]"] = userUID

    // console.log("(within index.js) users = "+JSON.stringify(users));
    // if(users != undefined && users[0]["ExponentPushToken[rEhLFwBuiwPQ7PFfeOH0HT]"] != undefined) {
    //     console.log("(user[0][feh] = "+users[0]["ExponentPushToken[rEhLFwBuiwPQ7PFfeOH0HT]"]);
    // }
    // else {
    //     console.log("(user[feh] = undefined");
    // }
    
    // send the push notifications
    let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log("ticket Chunk = "+JSON.stringify(ticketChunk));
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors

                //check if there were any errors
                for(let ticket of ticketChunk) {
                    if(ticket["details"] != undefined) {
                        //then error is present
                        if(ticket["details"]["error"] == "DeviceNotRegistered") {
                            let pushToken = ticket["details"]["expoPushToken"];
                            //users[0]["ExponentPushToken[rEhLFwBuiwPQ7PFfeOH0HT]"] = userUID
                            //getting the userUID that corresponds to the expoPushToken
                            let userUID = undefined;
                            for(let user of users) {
                                if(user[pushToken] != undefined) {
                                    userUID = user[pushToken];
                                }
                            }

                            //if found, update user's data
                            if(userUID != undefined) {
                                //set the user's firebase data to not recieve push notifications
                                db.collection('users').doc(userUID).update({
                                    expoPushToken: "",
                                    pushNotificationEnabled: false,
                                })
                                .then(() => {
                                    console.log("successfully set user "+userUID+" to not recieve push notifications");
                                })
                                .catch((error) => console.log(error));
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    })();

    res.json({result: `return`});

});