import * as firebase from "firebase-admin";
import * as functions from "firebase-functions";
// import * as express from "express";
// import { emailUtils } from "./utils/EmailUtils";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.
firebase.initializeApp();

// const app = express();
// app.post("/", (req, res) => {
//   // Grab the email parameter.
//   const email = req.query.email;

//   // Basic validation
//   if (!email || !emailUtils.isEmailValid(email)) {
//     res.status(400).send("Wrong email format");
//   }

//   // Validate that the domain is registered
//   const domain = emailUtils.getDomain(email);
// });

exports.generateLink = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const email = req.query.email;

  // TODO: validate domain name

  // TODO: Search for existing link (no need to generate a new one)

  // TODO: generate a new link

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  // const snapshot = await firebase
  //   .database()
  //   .ref("/links")
  //   .orderByChild("email")
  //   .equalTo(email);

  const entry = await firebase
    .database()
    .ref("/users")
    .push({ email });

  res.send(entry);
});
