import databaseService from './services/DatabaseService';
import * as functions from 'firebase-functions';
import EmailUtils from './utils/EmailUtils';
import { ISlot } from './models/Slot';
import { HttpsError } from 'firebase-functions/lib/providers/https';

exports.registerDomain = functions.https.onRequest(async (req, res) => {
    const domain = req.query['domain'];
    if (!domain) {
        res.status(400).send('Domain must be specified');
        return;
    }

    // Check if the domain is already registered
    const existingDomain = await databaseService.getDomainFromName(domain);
    if (existingDomain) {
        console.log(`Domain ${domain} is already registered`);
        res.status(400).send(`Domain ${domain} is already registered`);
        return;
    }

    console.log(`Registering Domain ${domain}`);
    const domainKey = await databaseService.addDomain({ domain });
    // TODO: Implement a full slot management functions set
    // Just use the ones describe in the exercise for now
    for (const slot of [
        // Mondays from 11:30 to 13:00 - 5 slots max
        {
            day: 1,
            start: '11:30am',
            end: '1:30pm',
            maxAttendees: 5,
        },
        // Wednesdays from 07:30 to 09:00 - 5 slots max
        {
            day: 3,
            start: '7:30am',
            end: '9:00am',
            maxAttendees: 5,
        },
        // Friday from 11:30 to 13:00 - 5 slots max
        {
            day: 5,
            start: '11:30am',
            end: '1:00pm',
            maxAttendees: 5,
        },
    ] as ISlot[]) {
        await databaseService.addSlot(domainKey, slot);
    }

    res.send(`Domain ${domain} was sucessfully registered with key ${domainKey}`);
});

exports.generateLink = functions.https.onCall(async (email: string) => {
    console.log(`Received ${email}`);

    if (email) {
        // Basic validation
        if (!EmailUtils.isEmailValid(email)) {
            throw new HttpsError('invalid-argument', `Wrong email format: ${email}`);
        } else {
            // Validate that the domain is registered
            const domain = EmailUtils.getDomain(email);
            const dbDomain = await databaseService.getDomainFromName(domain);
            if (!dbDomain) {
                throw new HttpsError(
                    'not-found',
                    `The domain ${domain} is not registered. Please contact your administrator.`,
                );
            } else {
                let key: string | null = null;

                // Check if the user is already registered
                const dbUser = await databaseService.getUserByEmail(email);
                if (dbUser) {
                    // Use the previously generated key
                    console.log(`Existing user, use previously generated key`);
                    // Grab the first property name as key (king of redundant with the .limitToFirst(1))
                    key = dbUser.key;
                } else {
                    key = await databaseService.addUser({
                        email,
                        // TODO: Move "isAdmin" calculation to (/users).on("add_child")
                        isAdmin: email.includes('+admin'),
                    });
                }
                // TODO: send email
                console.log(`Sending email with key ${key}`);
                return key;
            }
        }
    } else {
        throw new HttpsError('invalid-argument', 'must specify an email address');
    }
});

exports.generateLinkHttp = functions.https.onRequest(async (req, res) => {
    const email = req.query['email'];
    if (email) {
        // Basic validation
        if (!EmailUtils.isEmailValid(email)) {
            res.status(400).send('Wrong email format');
        } else {
            console.log(`Received email: ${email}`);
            // Validate that the domain is registered
            const domain = EmailUtils.getDomain(email);
            const dbDomain = await databaseService.getDomainFromName(domain);
            if (!dbDomain) {
                res.status(404).send(`The domain ${domain} is not registered. Please contact your administrator.`);
            } else {
                let key: string | null = null;

                // Check if the user is already registered
                const dbUser = await databaseService.getUserByEmail(email);
                if (dbUser) {
                    // Use the previously generated key
                    console.log(`Existing user, use previously generated key`);
                    // Grab the first property name as key (king of redundant with the .limitToFirst(1))
                    key = dbUser.key;
                } else {
                    key = await databaseService.addUser({
                        email,
                        // TODO: Move "isAdmin" calculation to (/users).on("add_child")
                        isAdmin: email.includes('+admin'),
                    });
                }
                // TODO: send email
                console.log(`Sending email with key ${key}`);
                res.send(key);
            }
        }
    } else {
        res.status(400).send('must specify an email address');
    }
});

exports.getUser = functions.https.onCall(async (userId: string) => {
    console.log(`Trying to retrieve use ${userId}`);
    if (userId) {
        const dbUser = await databaseService.getUserByKey(userId);
        if (dbUser) {
            console.log(`User with id ${userId} found, returning ${dbUser}`);
            return {
                key: dbUser.key,
                ...dbUser.value,
            };
        } else {
            console.log(`User with id ${userId} not found`);
            throw new HttpsError('not-found', `User with id ${userId} does not exist`);
        }
    } else {
        throw new HttpsError('invalid-argument', 'must specify a user id');
    }
});

// exports.getUserHttp = functions.https.onRequest(async (req, res) => {
//     const userId = req.query['userId'];

//     if (userId) {
//         const dbUser = await databaseService.getUserByKey(userId);
//         if (dbUser) {
//             res.send(dbUser.value);
//         } else {
//             res.status(404).send(`User with id ${userId} does not exist`);
//         }
//     } else {
//         res.status(400).send('must specify a user id');
//     }
// });
