/**
 * Describes an available recurring timeframe for a given domain
 */
// TODO: better start/end management to be able to check slots attribution inconsistency amongst several domains
export interface ISlot {
    // Day of the week: 0=Sunday, 1=Monday, etc
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    // Period start, plain text
    start: string;
    // Period end, plain text
    end: string;
    // Nb available places
    maxAttendees: number;
}
