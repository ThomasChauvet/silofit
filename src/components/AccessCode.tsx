import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/User';
import './AccessCode.css';
import { IDbSession } from '../models/Session';
import { UserContext } from '../contexts/UserContext';
import { SessionContext } from '../contexts/SessionContext';
import { FirebaseContext } from '../contexts/FirebaseContext';

interface IAccessCode {
    displayCode: string;
    extraClassName: string;
}

export const AccessCode: React.FC = () => {
    const [accessCode, setAccessCode] = useState<IAccessCode>({ displayCode: 'not ready', extraClassName: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const sessionContext = useContext(SessionContext);
    const session = sessionContext.session as IDbSession;
    const user = useContext(UserContext) as IUser;
    const firebaseFunctions = useContext(FirebaseContext);

    useEffect(() => {
        // If an access code is available, check if the user is an attendee
        const code = session.value.code;
        if (code) {
            setAccessCode(
                // Show code for attendees and admins
                (session.value.attendees || []).includes(user.email) || user.isAdmin
                    ? { displayCode: code, extraClassName: 'access-code-ok' }
                    : { displayCode: 'only for attendees', extraClassName: 'access-code-restricted' },
            );
        } else {
            setAccessCode({ displayCode: 'not ready', extraClassName: '' });
        }
    });

    const handleCodeGeneration = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        try {
            setLoading(true);
            firebaseFunctions
                ?.httpsCallable('generateAccessCode')({ userId: user.key, sessionId: session.key })
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
        <div className="access-code-wrapper">
            <div className={accessCode.extraClassName}>
                Access Code: {accessCode.displayCode.toUpperCase()}
                {!session.value.code && user.isAdmin && (
                    <button className="inline-button" onClick={handleCodeGeneration} disabled={loading}>
                        Generate Access Code
                    </button>
                )}
            </div>
        </div>
    );
};
