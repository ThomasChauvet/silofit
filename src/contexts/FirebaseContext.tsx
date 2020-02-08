import { createContext } from 'react';
import * as firebase from 'firebase';

export const FirebaseContext = createContext<firebase.functions.Functions | null>(null);
