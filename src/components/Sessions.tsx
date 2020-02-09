import React, { useState, useEffect, useContext } from 'react';
import { IDbSession } from '../models/Session';
import { Session } from './Session';
import './Sessions.css';
import { Loader } from './Loader';
import { UserContext } from '../contexts/UserContext';
import { IUser } from '../models/User';
import { FirebaseContext } from '../contexts/FirebaseContext';

export const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState<IDbSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const user = useContext(UserContext) as IUser;
    const firebaseService = useContext(FirebaseContext);

    useEffect(() => {
        try {
            firebaseService
                ?.getSessions(user.key)
                .then(result => {
                    setSessions(result);
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
    }, []);

    return (
        <div className="main-sessions-body">
            <Loader loading={loading} />
            {!loading && user && (
                <div className="sessions-wrapper">
                    {sessions.map(session => (
                        <Session session={session} />
                    ))}
                </div>
            )}
        </div>
    );
};
