import { createContext } from 'react';
import { IDbSession } from '../models/Session';

export interface ISessionContext {
    session?: IDbSession;
    refreshSession: (session: IDbSession) => void | Promise<void>;
}

export const SessionContext = createContext<ISessionContext>({
    refreshSession: () => {},
});
