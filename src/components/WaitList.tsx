import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/User';
import './Waitlist.css';
import { UserContext } from '../contexts/UserContext';

interface IWaitListProps {
    list: string[];
}

export const WaitList: React.FC<IWaitListProps> = props => {
    const [showContent, setShowContent] = useState<Boolean>(false);
    const [waitingRank, setWaitingRank] = useState<number>(0);
    const user = useContext(UserContext) as IUser;

    useEffect(() => {
        // No need to show anything if the slots are not filled yet
        setShowContent(props.list.length > 0);
        // Check if a connected regular user is already on the waiting list
        setWaitingRank(user.isAdmin ? 0 : props.list.findIndex(waiting => waiting === user.email));
    });

    return (
        <div className="waiting-list">
            {showContent && user.isAdmin && <div className="alert alert-info">Waitlist ({props.list.length})</div>}
            {showContent && waitingRank > 0 && (
                <div className="alert alert-info">
                    You are currently #{waitingRank} out of {props.list.length} on the waitlist.
                </div>
            )}
            {showContent && waitingRank < 0 && (
                <button className="inline-button">Join the waitlist ({props.list.length})</button>
            )}
        </div>
    );
};
