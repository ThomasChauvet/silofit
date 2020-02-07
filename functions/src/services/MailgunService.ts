import * as mailgun from 'mailgun-js';
import * as functions from 'firebase-functions';
import { hostedAppLink } from './FirebaseService';

const DOMAIN = functions.config().mailgun.domain;
const mg = mailgun({ apiKey: functions.config().mailgun.key, domain: DOMAIN });

export const sendLink = (email: string, userKey: string): Promise<mailgun.messages.SendResponse> => {
    const link = `${hostedAppLink}/${userKey}`;
    const data: mailgun.messages.SendData = {
        from: `Silofit Sandbox <postmaster@${DOMAIN}>`,
        to: email,
        subject: 'Silofit calendar link',
        html:
            '<div>Hey there, this is your <b>private</b> link to book sessions at Silofit:</div>' +
            `<a href='${link}'>${link}</a>` +
            '<div>Save it on your browser and always use it to booke your sessions</div>' +
            '<p><div>Stay fit!</div><div>The Silofit Team</div></p>',
    };
    return mg.messages().send(data);
};
