import React, { useState, useEffect } from 'react';
import { ISession } from '../models/Session';
import { IUser } from '../models/User';
import { Attendee } from './Attendee';
import './Session.css';
import { WaitList } from './WaitList';
import { AccessCode } from './AccessCode';

interface ISessionsProps {
    session: ISession;
    user: IUser;
}

export const Session: React.FC<ISessionsProps> = props => {
    const [bookingSpots, setBookingSpots] = useState<(string | null)[]>([]);
    const [waitList, setWaitingList] = useState<string[]>([]);

    useEffect(() => {
        // Manage attendees slots from session definition
        const spots = new Array<string | null>(props.session.maxAttendees)
            .fill(null)
            // Fill with attendees
            .map((value, index) => props.session.attendees[index] || value);
        // spots.push(...props.session.attendees.slice(0, props.session.maxAttendees));
        setBookingSpots(spots);
        setWaitingList(props.session.attendees.slice(props.session.maxAttendees, props.session.attendees.length));
    });

    return (
        <div className="session-wrapper">
            <div className="session-description">
                <div>{props.session.date}</div>
                <div>
                    {props.session.start} - {props.session.end}
                </div>
            </div>
            <div className="session-attendees">
                {bookingSpots.map(attendee => (
                    <Attendee attendee={attendee} user={props.user} />
                ))}
                {waitList.length > 0 && <WaitList list={waitList} user={props.user} />}
            </div>
            <div className="session-access-code">
                <AccessCode session={props.session} user={props.user} />
            </div>
        </div>
    );
};
