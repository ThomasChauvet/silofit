import databaseService from './services/DatabaseService';
import EmailUtils from './utils/EmailUtils';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { sendLink } from './services/EmailService';

export const addUser = async (data: { email: string }) => {
    if (!data.email) {
        throw new HttpsError('invalid-argument', 'must specify an email address');
    }

    // Basic validation
    if (!EmailUtils.isEmailValid(data.email)) {
        throw new HttpsError('invalid-argument', `Wrong email format: ${data.email}`);
    }
    // Validate that the domain is registered
    const domain = EmailUtils.getDomain(data.email);
    const dbDomain = await databaseService.getDomainByName(domain);
    if (!dbDomain) {
        throw new HttpsError('not-found', `The domain ${domain} is not registered. Please contact your administrator.`);
    } else {
        let key: string | null = null;

        // Check if the user is already registered
        const dbUser = await databaseService.getUserByEmail(data.email);
        if (dbUser) {
            // Grab the first property name as key (king of redundant with the .limitToFirst(1))
            key = dbUser.key;
        } else {
            key = await databaseService.addUser({
                email: data.email,
                // TODO: Move "isAdmin" calculation to (/users).on("add_child")
                isAdmin: data.email.includes('+admin'),
            });
        }
        // Send email
        try {
            sendLink(data.email, key);
            return 'ok';
        } catch (e) {
            console.log(e);
            throw new HttpsError('internal', `Email server is unavailable at the moment`);
        }
    }
};

export const getUser = async (data: { userId: string }) => {
    if (!data.userId) {
        throw new HttpsError('invalid-argument', 'must specify a user id');
    }
    const dbUser = await databaseService.getUserByKey(data.userId);

    if (!dbUser) {
        throw new HttpsError('not-found', `User with id ${data.userId} does not exist`);
    }

    return {
        key: dbUser.key,
        ...dbUser.value,
    };
};
