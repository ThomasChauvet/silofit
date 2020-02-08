import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/User';
import './Attendee.css';
import { IDbSession } from '../models/Session';
import { SessionContext } from '../contexts/SessionContext';
import { UserContext } from '../contexts/UserContext';
import { FirebaseContext } from '../contexts/FirebaseContext';

interface IAttendeeProps {
    attendee: string | null;
}

export const Attendee: React.FC<IAttendeeProps> = props => {
    const [loading, setLoading] = useState<boolean>(false);
    const [attending, setAttending] = useState<boolean>(false);
    const sessionContext = useContext(SessionContext);
    const session = sessionContext.session as IDbSession;
    const user = useContext(UserContext) as IUser;
    const firebaseFunctions = useContext(FirebaseContext);

    useEffect(() => {
        // setAttending((props.session.value.attendees || []).includes(props.user.email));
        setAttending((session.value.attendees || []).includes(user.email));
    });

    const handleBooking = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        try {
            setLoading(true);
            firebaseFunctions
                ?.httpsCallable('addBooking')({ userId: user.key, sessionId: session.key })
                .then(result => {
                    sessionContext.refreshSession(result.data);
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
            firebaseFunctions
                ?.httpsCallable('cancelBooking')({
                    userId: user.key,
                    sessionId: session.key,
                })
                .then(result => {
                    sessionContext.refreshSession(result.data);
                    setLoading(false);
                });
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
                    {(user.isAdmin || user.email === props.attendee) && (
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
