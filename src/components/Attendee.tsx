import React, { useState, useEffect } from 'react';
import { IUser } from '../models/User';
import './Attendee.css';
import { callFirebaseFunction } from '../services/FirebaseService';
import { IDbSession } from '../models/Session';

interface IAttendeeProps {
    attendee: string | null;
    user: IUser;
    session: IDbSession;
}

export const Attendee: React.FC<IAttendeeProps> = props => {
    const [loading, setLoading] = useState<boolean>(false);
    const [attending, setAttending] = useState<boolean>(false);

    useEffect(() => {
        setAttending((props.session.value.attendees || []).includes(props.user.email));
    });

    const handleBooking = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        try {
            setLoading(true);
            callFirebaseFunction('addBooking', { userId: props.user.key, sessionId: props.session.key }).then(() => {
                if (!props.session.value.attendees) {
                    props.session.value.attendees = [];
                }
                props.session.value.attendees.push(props.user.email);
                setLoading(false);
            });
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleCancellation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        try {
            setLoading(true);
            callFirebaseFunction('cancelBooking', { userId: props.user.key, sessionId: props.session.key }).then(() =>
                setLoading(false),
            );
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <div className="attendee">
            {props.attendee && (
                <div className="attendee-name">
                    {props.attendee}
                    {(props.user.isAdmin || props.user.email === props.attendee) && (
                        <button className="inline-button" onClick={handleCancellation} disabled={loading}>
                            Cancel booking
                        </button>
                    )}
                </div>
            )}
            {!props.attendee && !attending && (
                <button onClick={handleBooking} disabled={loading}>
                    Book now
                </button>
            )}
        </div>
    );
};
