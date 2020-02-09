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
    const [showContent, setShowContent] = useState<Boolean>(false);
    const [waitingRank, setWaitingRank] = useState<number>(0);
    const user = useContext(UserContext) as IUser;
    const firebaseFunctions = useContext(FirebaseContext);
    const sessionContext = useContext(SessionContext);

    useEffect(() => {
        console.log(`Rendering waitlist for session ${sessionContext.session?.key}`);
        // No need to show anything if the slots are not filled yet
        setShowContent(props.list.length > 0);
        // Check if a connected regular user is already on the waiting list
        setWaitingRank(user.isAdmin ? 0 : props.list.findIndex(waiting => waiting === user.email));
    });

    const handleBooking = (): void => {
        console.log(`Adding ${user.email} to waitlist for session ${sessionContext.session?.key}`);
        setLoading(true);
        firebaseFunctions
            ?.httpsCallable('addBooking')({ userId: user.key, sessionId: sessionContext.session?.key })
            .then(result => {
                console.log(`Refreshing session ${sessionContext.session?.key} after waitlist`);
                sessionContext.refreshSession(result.data);
                setLoading(false);
                console.log(`Added ${user.email} to waitlist for session ${sessionContext.session?.key}`);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    };

    return (
        <div className="waiting-list">
            {showContent && user.isAdmin && <div className="alert alert-info">Waitlist ({props.list.length})</div>}
            {showContent && waitingRank > 0 && (
                <div className="alert alert-info">
                    You are currently #{waitingRank} out of {props.list.length} on the waitlist.
                </div>
            )}
            {showContent && waitingRank < 0 && (
                <button className="inline-button" onClick={handleBooking} disabled={loading}>
                    Join the waitlist ({props.list.length})
                </button>
            )}
        </div>
    );
};
