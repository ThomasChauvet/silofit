/**
 * Scheduled session model
 */
export interface ISession {
    // Company domain
    domain: string;
    // Session date (YYYYMMDD) format
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
    attendees?: string[];
}
