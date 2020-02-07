import * as firebase from 'firebase-admin';

firebase.initializeApp();
export const appDB = firebase.database();
// TODO: Set baseUrl in a config file so it could work with local environments?
export const hostedAppLink = `https://${firebase.instanceId().app.options.projectId}.firebaseapp.com`;
