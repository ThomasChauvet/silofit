import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/User';
import './Attendee.css';
import { UserContext } from '../contexts/UserContext';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { SessionContext } from '../contexts/SessionContext';

interface IAttendeeProps {
    attendee: string | null;
    showBookingButton: boolean;
}

export const Attendee: React.FC<IAttendeeProps> = props => {
    const [loading, setLoading] = useState<boolean>(false);
    const [attending, setAttending] = useState<boolean>(false);
    const user = useContext(UserContext) as IUser;
    const firebaseService = useContext(FirebaseContext);
    const sessionContext = useContext(SessionContext);

    useEffect(() => {
        setAttending((sessionContext.session?.value.attendees || []).includes(user.email));
    }, []);

    const handleBooking = (): void => {
        setLoading(true);
        try {
            firebaseService
                ?.addBooking(sessionContext.session?.key as string, user.key)
                .then(result => {
                    sessionContext.refreshSession(result);
                    setLoading(false);
                })
                .catch(e => {
                    console.error(e);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleCancellation = (): void => {
        setLoading(true);

        firebaseService
            ?.cancelBooking(
                sessionContext.session?.key as string,
                user.key,
                user.isAdmin ? (props.attendee as string) : undefined,
            )
            .then(result => {
                sessionContext.refreshSession(result);
                setLoading(false);
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
            {!props.attendee && !attending && props.showBookingButton && (
                <div>
                    <button onClick={handleBooking} disabled={loading}>
                        Book now
                    </button>
                </div>
            )}
        </div>
    );
};
