import databaseService from './services/DatabaseService';
import { ISlot } from './models/Slot';
import * as functions from 'firebase-functions';

export const registerDomain = async (req: functions.https.Request, res: functions.Response) => {
    const domain = req.query['domain'];
    if (!domain) {
        res.status(400).send('Domain must be specified');
        return;
    }

    // Check if the domain is already registered
    const existingDomain = await databaseService.getDomainByName(domain);
    if (existingDomain) {
        res.status(400).send(`Domain ${domain} is already registered`);
        return;
    }

    const domainKey = await databaseService.addDomain({ domain });
    // TODO: Implement a full slot management functions set
    // Just use the ones describe in the exercise for now
    for (const slot of [
        // Mondays from 11:30 to 13:00 - 5 slots max
        {
            day: 1,
            start: '11:30',
            end: '13:30',
            maxAttendees: 5,
        },
        // Wednesdays from 07:30 to 09:00 - 5 slots max
        {
            day: 3,
            start: '07:30',
            end: '09:00',
            maxAttendees: 5,
        },
        // Friday from 11:30 to 13:00 - 5 slots max
        {
            day: 5,
            start: '11:30',
            end: '13:00',
            maxAttendees: 5,
        },
    ] as ISlot[]) {
        await databaseService.addSlot(domainKey, slot);
    }

    res.send(`Domain ${domain} was sucessfully registered with key ${domainKey}`);
};
