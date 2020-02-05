import React, { useState, useEffect } from 'react';
import { IUser } from '../models/User';
import './AccessCode.css';
import { ISession } from '../models/Session';

interface IAccessCodeProps {
    session: ISession;
    user: IUser;
}

interface IAccessCode {
    displayCode: string;
    extraClassName: string;
}

export const AccessCode: React.FC<IAccessCodeProps> = props => {
    const [accessCode, setAccessCode] = useState<IAccessCode>({ displayCode: 'not ready', extraClassName: '' });

    useEffect(() => {
        // If an access code is available, check if the user is an attendee
        const code = props.session.code;
        if (code) {
            setAccessCode(
                props.session.attendees.includes(props.user.email)
                    ? { displayCode: code, extraClassName: 'access-code-ok' }
                    : { displayCode: 'only for attendees', extraClassName: 'access-code-restricted' },
            );
        } else {
            setAccessCode({ displayCode: 'not ready', extraClassName: '' });
        }
    });

    return (
        <div className="access-code-wrapper">
            <div className={accessCode.extraClassName}>Access Code: {accessCode.displayCode.toUpperCase()}</div>
        </div>
    );
};
