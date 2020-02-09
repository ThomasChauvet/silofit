import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/User';
import './Waitlist.css';
import { UserContext } from '../contexts/UserContext';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { SessionContext } from '../contexts/SessionContext';

interface IWaitListProps {
    list: string[];
}

export const WaitList: React.FC<IWaitListProps> = props => {
    const [loading, setLoading] = useState<boolean>(false);
    const [waitingRank, setWaitingRank] = useState<number>(0);
    const user = useContext(UserContext) as IUser;
    const firebaseService = useContext(FirebaseContext);
    const sessionContext = useContext(SessionContext);

    useEffect(() => {
        // Check if a connected regular user is already on the waiting list
        setWaitingRank(user.isAdmin ? -1 : props.list.findIndex(waiting => waiting === user.email) + 1);
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

    return (
        <div className="waiting-list">
            {user.isAdmin && <div className="alert alert-info">Waitlist ({props.list.length})</div>}
            {waitingRank > 0 && (
                <div className="alert alert-info">
                    You are currently #{waitingRank} out of {props.list.length} on the waitlist
                </div>
            )}
            {waitingRank === 0 && (
                <button className="inline-button" onClick={handleBooking} disabled={loading}>
                    Join the waitlist ({props.list.length})
                </button>
            )}
        </div>
    );
};
