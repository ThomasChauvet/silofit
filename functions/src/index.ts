import * as functions from 'firebase-functions';
import { registerDomain } from './domain';
import { getSession, getSessions, addAttendee, removeAttendee, generateCode } from './session';
import { addUser, getUser } from './user';

exports.registerDomain = functions.https.onRequest(registerDomain);
exports.generateLink = functions.https.onCall(addUser);
exports.getUser = functions.https.onCall(getUser);
exports.getSessions = functions.https.onCall(getSessions);
exports.getSession = functions.https.onCall(getSession);
exports.addBooking = functions.https.onCall(addAttendee);
exports.cancelBooking = functions.https.onCall(removeAttendee);
exports.generateAccessCode = functions.https.onCall(generateCode);
