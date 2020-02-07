import * as functions from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';

const getResponseStatus = (error: HttpsError): number => {
    switch (error.code) {
        case 'invalid-argument':
            return 400;
        case 'not-found':
            return 404;
        case 'permission-denied':
            return 403;
        default:
            return 500;
    }
};

/**
 * Calls an onCallHandler with params retrieved from the incoming request
 * @param onCallHandler
 * @param args: expected arguments names
 */
export const generateHttpFunction = (
    onCallHandler: (...args: any[]) => any,
    ...args: string[]
): ((req: functions.https.Request, resp: functions.Response) => void) => (
    req: functions.https.Request,
    resp: functions.Response,
) => {
    // Generate data from args list
    const data = [];
    for (const arg of args) {
        const value = req.query[arg];
        if (!value) {
            resp.status(400).send(`${arg} is mandatory`);
            return;
        }
        data.push(value);
    }
    try {
        resp.send(onCallHandler(...data));
    } catch (e) {
        if (e instanceof HttpsError) {
            resp.status(getResponseStatus(e)).send(e.message);
        }
    }
};
