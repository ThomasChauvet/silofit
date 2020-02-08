/**
 * Scheduled session model
 */
export interface ISession {
    // Session date (YYYY-MM-DD) format
    date: string;
    // Start time
    start: string;
    // End time
    end: string;
    // Access code
    code?: string;
    // Max # of attendees
    maxAttendees: number;
    // List of registered attendees (includes the ones on the waitlist)
    attendees: string[];
}

export interface IDbSession {
    key: string;
    value: ISession;
}
