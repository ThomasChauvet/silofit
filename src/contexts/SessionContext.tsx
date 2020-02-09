import { createContext } from 'react';
import { IDbSession } from '../models/Session';

export interface ISessionContext {
    session?: IDbSession;
    refreshSession: (session: IDbSession) => void | Promise<void>;
    showBookingButton: boolean;
}

export const SessionContext = createContext<ISessionContext>({
    refreshSession: () => {},
    showBookingButton: true,
});
