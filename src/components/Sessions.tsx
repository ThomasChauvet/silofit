import React, { useState, useEffect } from 'react';
import { IDbSession } from '../models/Session';
import { Session } from './Session';
import { RouteChildrenProps, Link } from 'react-router-dom';
import './Sessions.css';
import { callFirebaseFunction } from '../services/FirebaseService';
import { Loader } from './Loader';

export const Sessions: React.FC<RouteChildrenProps<{ userId?: string }>> = props => {
    const [sessions, setSessions] = useState<IDbSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            callFirebaseFunction('getSessions', { userId: props.match?.params.userId })
                .then(dbSessions => {
                    setSessions(dbSessions);
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

    const [user, setUser] = useState();

    useEffect(() => {
        try {
            callFirebaseFunction('getUser', { userId: props.match?.params.userId })
                .then(dbUser => {
                    setUser(dbUser);
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
            {!loading && !user && (
                <div className="no-user-sessions">
                    This link is invalid, please <Link to="/">Register</Link> before trying to book a session.
                </div>
            )}
            {!loading && user && (
                <div className="sessions-container">
                    <div className="greetings">{user.email}</div>
                    <div className="sessions-wrapper">
                        {sessions.map(session => (
                            <Session session={session} user={user} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
