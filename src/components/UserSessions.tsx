import React, { useState, useEffect, useContext } from 'react';
import { RouteChildrenProps, Link } from 'react-router-dom';
import './Sessions.css';
import { Loader } from './Loader';
import { UserProvider } from '../contexts/UserContext';
import { Sessions } from './Sessions';
import { FirebaseContext } from '../contexts/FirebaseContext';

export const UserSessions: React.FC<RouteChildrenProps<{ userId?: string }>> = props => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState();
    const firebaseService = useContext(FirebaseContext);

    useEffect(() => {
        try {
            firebaseService
                ?.getUser(props.match?.params.userId as string)
                .then(result => {
                    setUser(result);
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
                    <UserProvider value={user}>
                        <Sessions />
                    </UserProvider>
                </div>
            )}
        </div>
    );
};
