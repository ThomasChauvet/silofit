import { createContext } from 'react';
import { FirebaseService } from '../services/FireBaseService';

export const FirebaseContext = createContext<FirebaseService | undefined>(undefined);
