import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';
import { hostedAppLink } from './FirebaseService';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().gmail.user,
        pass: functions.config().gmail.password,
    },
});

export const sendLink = (email: string, userKey: string) => {
    const link = `${hostedAppLink}/${userKey}`;
    const data = {
        from: `Silofit Sandbox <${functions.config().gmail.user}>`,
        to: email,
        subject: 'Silofit calendar link',
        html:
            '<div>Hey there, this is your <b>private</b> link to book sessions at Silofit:</div>' +
            `<a href='${link}'>${link}</a>` +
            '<div>Save it on your browser and always use it to booke your sessions</div>' +
            '<p><div>Stay fit!</div><div>The Silofit Team</div></p>',
    };

    transporter.sendMail(data, function(err, info) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            // TODO: manage NOK return codes
            return info;
        }
    });
};
