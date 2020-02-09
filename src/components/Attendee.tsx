import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/User';
import './Attendee.css';
import { UserContext } from '../contexts/UserContext';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { SessionContext } from '../contexts/SessionContext';

interface IAttendeeProps {
    attendee: string | null;
}

export const Attendee: React.FC<IAttendeeProps> = props => {
    const [loading, setLoading] = useState<boolean>(false);
    const [attending, setAttending] = useState<boolean>(false);
    const user = useContext(UserContext) as IUser;
    const firebaseFunctions = useContext(FirebaseContext);
    const sessionContext = useContext(SessionContext);

    useEffect(() => {
        console.log(`Rendering ${user.email} attendance for session ${sessionContext.session?.key}`);
        setAttending((sessionContext.session?.value.attendees || []).includes(user.email));
    }, []);

    const handleBooking = (): void => {
        console.log(`Adding ${user.email} attendance for session ${sessionContext.session?.key}`);
        setLoading(true);
        firebaseFunctions
            ?.httpsCallable('addBooking')({ userId: user.key, sessionId: sessionContext.session?.key })
            .then(result => {
                console.log(`Refreshing session ${sessionContext.session?.key} after booking`);
                sessionContext.refreshSession(result.data);
                setLoading(false);
                console.log(`Added ${user.email} attendance for session ${sessionContext.session?.key}`);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    };

    const handleCancellation = (): void => {
        setLoading(true);

        // Self cancelation or admin cancelation?
        const data: any = {
            userId: user.key,
            sessionId: sessionContext.session?.key,
        };
        if (user.isAdmin) {
            data.email = props.attendee;
        }

        console.log(`Cancelling ${data.email} attendance for session ${sessionContext.session?.key}`);
        firebaseFunctions
            ?.httpsCallable('cancelBooking')(data)
            .then(result => {
                console.log(`Refreshing session ${sessionContext.session?.key} after cancellation`);
                sessionContext.refreshSession(result.data);
                setLoading(false);
                console.log(`Cancelled ${user.email} attendance for session ${sessionContext.session?.key}`);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
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
                <div>
                    <button onClick={handleBooking} disabled={loading}>
                        Book now
                    </button>
                </div>
            )}
        </div>
    );
};
