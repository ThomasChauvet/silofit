import * as firebase from 'firebase-admin';

firebase.initializeApp();
export const appDB = firebase.database();
