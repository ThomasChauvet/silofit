import { createContext } from 'react';
import { IDbSession } from '../models/Session';

export interface ISessionContext {
    session: IDbSession | null;
    refreshSession: (session: IDbSession) => void | Promise<void>;
}

export const SessionContext = createContext<ISessionContext>({
    session: null,
    refreshSession: () => {},
});

export const SessionProvider = SessionContext.Provider;
export const SessionConsumer = SessionContext.Consumer;
