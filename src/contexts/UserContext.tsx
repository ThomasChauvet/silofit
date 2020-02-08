import { createContext } from 'react';
import { IUser } from '../models/User';

export const UserContext = createContext<IUser | null>(null);
export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
