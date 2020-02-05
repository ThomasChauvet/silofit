export interface ISession {
    date: string;
    start: string;
    end: string;
    maxAttendees: number;
    code?: string;
    attendees: string[];
}
