import { HttpsError } from 'firebase-functions/lib/providers/https';
import databaseService from './services/DatabaseService';
import { IDbSession } from './models/Session';
import * as moment from 'moment';
import EmailUtils from './utils/EmailUtils';
import { IDbUser } from './models/User';
import { IDbDomain } from './models/Domain';

export const getSessions = async (data: { userId: string }) => {
    if (!data.userId) {
        throw new HttpsError('invalid-argument', 'must specify a user id');
    }

    // Look for matching domain
    const dbDomain = await databaseService.getDomainByUserKey(data.userId);

    // Domain not found = nothing we can do
    if (!dbDomain) {
        throw new HttpsError('not-found', `No matching domain found for user ${data.userId}`);
    }

    const domainKey = dbDomain.key;
    const domain = dbDomain.value;
    const sessions = new Array<IDbSession>();

    // Loop over available slots
    if (domain.slots) {
        // Still in {key : slot} form at this point
        // Looking for entries starting today for a whole month
        const today = moment();
        const periodEnd = moment()
            .add(1, 'M')
            .subtract(1, 'd');

        for (const slotKey of Object.getOwnPropertyNames(domain.slots)) {
            const slotDefinition = domain.slots[slotKey];
            // Start looking for all days occurences between now and then
            const d = moment().day(slotDefinition.day + (today.day() <= slotDefinition.day ? 0 : 7));

            while (d < periodEnd) {
                const sessionKey = `${d.format('YYYY-MM-DD')}-${slotDefinition.start}-${slotDefinition.end}`;
                // Look for existing session
                const existingSession = await databaseService.getSession(domainKey, sessionKey);
                if (existingSession) {
                    sessions.push(existingSession);
                } else {
                    sessions.push(
                        await databaseService.updateSession(domainKey, sessionKey, {
                            date: d.format('YYYY-MM-DD'),
                            start: slotDefinition.start,
                            end: slotDefinition.end,
                            maxAttendees: slotDefinition.maxAttendees,
                            attendees: [],
                        }),
                    );
                }

                // Go to next week
                d.add(1, 'w');
            }
        }
    }

    // Make sure sessions are sorted by date/hour
    return sessions.sort((a, b) => (b.key > a.key ? -1 : 1));
};

const getSessionInfos = async (
    userId: string,
    sessionId: string,
    restrictedToadmins: boolean = false,
): Promise<{ dbUser: IDbUser; dbDomain: IDbDomain; dbSession: IDbSession }> => {
    // No ids = nothing we can do
    if (!sessionId) {
        throw new HttpsError('invalid-argument', 'must specify a session id');
    }
    if (!userId) {
        throw new HttpsError('invalid-argument', 'must specify a user id');
    }

    // Find user
    const dbUser = await databaseService.getUserByKey(userId);
    // User not found = nothing we can do
    if (!dbUser) {
        throw new HttpsError('not-found', `User with id ${userId} does not exist`);
    }
    // Restriced to admins
    else if (restrictedToadmins && !dbUser.value.isAdmin) {
        throw new HttpsError('permission-denied', `You do not have the proper permissions`);
    }
    const userName = dbUser.value.email;

    // Look for matching domain
    const dbDomain = await databaseService.getDomainByName(EmailUtils.getDomain(userName));
    // Domain not found = nothing we can do
    if (!dbDomain) {
        throw new HttpsError('not-found', `No matching domain found for user ${userId}`);
    }

    // Find session
    const dbSession = await databaseService.getSession(dbDomain.key, sessionId);
    // Session not found = nothing we can do
    if (!dbSession) {
        throw new HttpsError('not-found', `Session with id ${sessionId} does not exist for ${dbDomain.value.domain}`);
    }

    // Make sure attendees list is initiated for manipulations
    dbSession.value.attendees = dbSession.value.attendees || [];

    return {
        dbDomain,
        dbSession,
        dbUser,
    };
};

export const getSession = async (data: { userId: string; sessionId: string }): Promise<IDbSession> => {
    const sessionInfos = await getSessionInfos(data.userId, data.sessionId);
    // return the session
    return sessionInfos.dbSession;
};

export const addAttendee = async (data: { userId: string; sessionId: string }): Promise<IDbSession> => {
    const sessionInfos = await getSessionInfos(data.userId, data.sessionId);
    // Update session attendees list
    const session = sessionInfos.dbSession;

    // Add user email to attendees list if not already present
    if (!session.value.attendees.includes(sessionInfos.dbUser.value.email)) {
        session.value.attendees.push(sessionInfos.dbUser.value.email);
        await databaseService.updateSession(sessionInfos.dbDomain.key, sessionInfos.dbSession.key, session.value);
    }
    // return the updated session
    return session;
};

export const removeAttendee = async (data: {
    userId: string;
    sessionId: string;
    email?: string;
}): Promise<IDbSession> => {
    // Only admins can specify a different email to cancel
    const sessionInfos = await getSessionInfos(data.userId, data.sessionId, data.email !== undefined);
    // Update session attendees list
    const session = sessionInfos.dbSession;

    const attendeeEmail = data.email || sessionInfos.dbUser.value.email;

    // Remove user email from attendees list if present
    const idx = session.value.attendees.indexOf(attendeeEmail);
    if (idx > -1) {
        session.value.attendees.splice(idx, 1);
        await databaseService.updateSession(sessionInfos.dbDomain.key, sessionInfos.dbSession.key, session.value);
    }
    // return the updated session
    return session;
};

export const generateCode = async (data: { userId: string; sessionId: string }): Promise<IDbSession> => {
    const sessionInfos = await getSessionInfos(data.userId, data.sessionId);
    // Update session attendees list
    const session = sessionInfos.dbSession;

    // Generate access code for the current session
    if (!session.value.code) {
        // TODO: Check what the proper access code format should be
        // Just using the color generator from the front end test for now ;)
        session.value.code = Math.floor(Math.random() * 0x1000000)
            .toString(16)
            .padStart(6, '0');
        await databaseService.updateSession(sessionInfos.dbDomain.key, sessionInfos.dbSession.key, session.value);
    }
    // return the updated session
    return session;
};
