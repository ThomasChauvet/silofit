import React, { useState, useEffect } from 'react';
// import * as firebase from 'firebase';
import { ISession } from '../models/Session';
import { Session } from './Session';
import { RouteChildrenProps, Link } from 'react-router-dom';
import { IUser } from '../models/User';
import './Sessions.css';

export const Sessions: React.FC<RouteChildrenProps<{ userId?: string }>> = props => {
    const [sessions, setSessions] = useState<ISession[]>([]);

    useEffect(() => {
        fetchSessions();
    });

    const fetchSessions = async () => {
        // TODO: fetch from cloud function
        setSessions([
            {
                date: 'some day in 2020',
                start: '11:30am',
                end: '1:30pm',
                maxAttendees: 3,
                code: 'ABC456',
                attendees: ['someone1@gmail.com'],
            },
            {
                date: 'some other day in 2020',
                start: '11h30',
                end: '13h30',
                maxAttendees: 3,
                code: 'ABC123',
                attendees: ['someone1@gmail.com', 'test@gmail.com'],
            },
            {
                date: 'yet another day in 2020',
                start: '11h30',
                end: '13h30',
                maxAttendees: 3,
                attendees: ['someone1@gmail.com', 'someone2@gmail.com', 'someone3@gmail.com', 'someone4@gmail.com'],
            },
            {
                date: "let's keep rolling",
                start: '11h30',
                end: '13h30',
                maxAttendees: 3,
                attendees: [
                    'someone1@gmail.com',
                    'someone2@gmail.com',
                    'someone3@gmail.com',
                    'someone4@gmail.com',
                    'test@gmail.com',
                    'someone5@gmail.com',
                    'someone6@gmail.com',
                ],
            },
        ]);
    };

    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        // try {
        //     firebase
        //         .functions()
        //         .httpsCallable('getUser')(props.match?.params.userId)
        //         .then(result => setUser(result.data));
        // } catch (e) {
        //     console.error(e);
        // }

        if (props.match?.params.userId === '123') {
            setUser({ key: props.match.params.userId, email: 'test@gmail.com', isAdmin: false });
        } else if (props.match?.params.userId === '456') {
            setUser({ key: props.match.params.userId, email: 'test@gmail.com', isAdmin: true });
        } else {
            setUser(null);
        }
    });

    return (
        <div className="main-sessions-body">
            {!user && (
                <div className="no-user-sessions">
                    This link is invalid, please <Link to="/">Register</Link> before trying to book a session.
                </div>
            )}
            {user && (
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
