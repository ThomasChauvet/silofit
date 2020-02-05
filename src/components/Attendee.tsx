import React from 'react';
import { IUser } from '../models/User';
import './Attendee.css';

interface IAttendeeProps {
    attendee: string | null;
    user: IUser;
}

export const Attendee: React.FC<IAttendeeProps> = props => (
    <div className="attendee">
        {props.attendee && (
            <div className="attendee-name">
                {props.attendee}
                {(props.user.isAdmin || props.user.email === props.attendee) && (
                    <button className="inline-button">Cancel booking</button>
                )}
            </div>
        )}
        {!props.attendee && <button>Book now</button>}
    </div>
);
