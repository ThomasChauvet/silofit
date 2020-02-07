export interface ISession {
    date: string;
    start: string;
    end: string;
    maxAttendees: number;
    code?: string;
    attendees?: string[];
}

export interface IDbSession {
    key: string;
    value: ISession;
}
