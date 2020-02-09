import React, { useState, useEffect, useContext } from 'react';
import { IUser } from '../models/User';
import './AccessCode.css';
import { UserContext } from '../contexts/UserContext';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { SessionContext } from '../contexts/SessionContext';

interface IAccessCode {
    displayCode: string;
    extraClassName: string;
}

export const AccessCode: React.FC = () => {
    const [accessCode, setAccessCode] = useState<IAccessCode>({ displayCode: 'not ready', extraClassName: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const user = useContext(UserContext) as IUser;
    const firebaseService = useContext(FirebaseContext);
    const sessionContext = useContext(SessionContext);

    useEffect(() => {
        // If an access code is available, check if the user is an attendee
        const code = sessionContext.session?.value.code;
        if (code) {
            setAccessCode(
                // Show code for attendees and admins
                (sessionContext.session?.value.attendees || []).includes(user.email) || user.isAdmin
                    ? { displayCode: code, extraClassName: 'access-code-ok' }
                    : { displayCode: 'only for attendees', extraClassName: 'access-code-restricted' },
            );
        } else {
            setAccessCode({ displayCode: 'not ready', extraClassName: '' });
        }
    }, []);

    const handleCodeGeneration = (): void => {
        setLoading(true);
        try {
            firebaseService
                ?.generateAccessCode(sessionContext.session?.key as string, user.key)
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
        <div className="access-code-wrapper">
            <div className={accessCode.extraClassName}>
                Access Code: {accessCode.displayCode.toUpperCase()}
                {!sessionContext.session?.value.code && user.isAdmin && (
                    <button className="inline-button" onClick={handleCodeGeneration} disabled={loading}>
                        Generate Access Code
                    </button>
                )}
            </div>
        </div>
    );
};
