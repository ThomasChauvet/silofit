import React, { useState, useEffect } from 'react';
import { IDbSession } from '../models/Session';
import { IUser } from '../models/User';
import { Attendee } from './Attendee';
import './Session.css';
import { WaitList } from './WaitList';
import { AccessCode } from './AccessCode';

interface ISessionsProps {
    session: IDbSession;
    user: IUser;
}

export const Session: React.FC<ISessionsProps> = props => {
    const [bookingSpots, setBookingSpots] = useState<(string | null)[]>([]);
    const [waitList, setWaitingList] = useState<string[]>([]);

    useEffect(() => {
        const attendees = props.session.value.attendees || [];
        // Manage attendees slots from session definition
        const spots = new Array<string | null>(props.session.value.maxAttendees)
            .fill(null)
            // Fill with attendees
            .map((value, index) => attendees[index] || value);
        // spots.push(...props.session.attendees.slice(0, props.session.maxAttendees));
        setBookingSpots(spots);
        setWaitingList(attendees.slice(props.session.value.maxAttendees, attendees.length));
    });

    return (
        <div className="session-wrapper">
            <div className="session-description">
                <div>{props.session.value.date}</div>
                <div>
                    {props.session.value.start} - {props.session.value.end}
                </div>
            </div>
            <div className="session-attendees">
                {bookingSpots.map(attendee => (
                    <Attendee attendee={attendee} user={props.user} session={props.session} />
                ))}
                {waitList.length > 0 && <WaitList list={waitList} user={props.user} />}
            </div>
            <div className="session-access-code">
                <AccessCode session={props.session} user={props.user} />
            </div>
        </div>
    );
};
