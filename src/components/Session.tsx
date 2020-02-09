import React, { useState, useEffect } from 'react';
import { IDbSession } from '../models/Session';
import { Attendee } from './Attendee';
import './Session.css';
import { WaitList } from './WaitList';
import { AccessCode } from './AccessCode';
import dateFormat from 'dateformat';
import { Loader } from './Loader';
import { SessionContext } from '../contexts/SessionContext';

interface ISessionsProps {
    session: IDbSession;
}

export const Session: React.FC<ISessionsProps> = props => {
    const [loading, setLoading] = useState<boolean>(true);
    const [bookingSpots, setBookingSpots] = useState<(string | null)[]>([]);
    const [waitList, setWaitingList] = useState<string[]>([]);
    const [session, setSession] = useState<IDbSession>();

    const fetchSession = async (updatedSession: IDbSession) => {
        setLoading(true);
        try {
            setSession(updatedSession);
            const attendees = updatedSession.value.attendees || [];
            // Manage attendees slots from session definition
            const spots = new Array<string | null>(updatedSession.value.maxAttendees)
                .fill(null)
                // Fill with attendees
                .map((value, index) => attendees[index] || value);
            setBookingSpots(spots);
            setWaitingList(attendees.slice(updatedSession.value.maxAttendees, attendees.length));
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    // TODO: Implement something fencier that relies on the user locale
    // TODO: Fixme, this is sloppy
    const formatTime = (time: string): string => {
        // Input format = hh:mm 24h
        const timeParts = time.split(':');
        // am/pm
        if (timeParts[0] <= '12') {
            return time + 'am';
        }
        if (timeParts[0] === '12') {
            return time + 'pm';
        }
        // PM, need to drop 12 hours
        timeParts[0] = ('0' + (Number(timeParts[0]) - 12)).slice(-2);
        return timeParts.join(':') + 'pm';
    };

    const formatDate = (date: string): string => {
        return dateFormat(date, 'fullDate');
    };

    useEffect(() => {
        fetchSession(props.session);
    }, []);

    return (
        <div>
            <Loader loading={loading} />
            {!loading && session && (
                <SessionContext.Provider value={{ session, refreshSession: fetchSession }}>
                    <div className="session-wrapper">
                        <div className="session-description">
                            <div>{formatDate(session.value.date)}</div>
                            <div>
                                {formatTime(session.value.start)} - {formatTime(session.value.end)}
                            </div>
                        </div>
                        <div className="session-attendees">
                            {bookingSpots.map((attendee, index) => (
                                <Attendee
                                    attendee={attendee}
                                    // Only show Book now button for the first available slot
                                    showBookingButton={index <= bookingSpots.findIndex(entry => !entry)}
                                />
                            ))}
                            {waitList.length > 0 && <WaitList list={waitList} />}
                        </div>
                        <div className="session-access-code">
                            <AccessCode />
                        </div>
                    </div>
                </SessionContext.Provider>
            )}
        </div>
    );
};
