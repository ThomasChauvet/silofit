import * as firebase from 'firebase';
import { IUser } from '../models/User';
import { IDbSession } from '../models/Session';

export class FirebaseService {
    constructor(private readonly _functions: firebase.functions.Functions) {}

    public generateLink = async (email: string): Promise<void> => {
        await this._functions.httpsCallable('generateLink')({ email });
    };

    public getUser = async (userId: string): Promise<IUser> => {
        const result = await this._functions.httpsCallable('getUser')({ userId });
        return result.data;
    };

    public getSessions = async (userId: string): Promise<IDbSession[]> => {
        const result = await this._functions.httpsCallable('getSessions')({ userId });
        return result.data;
    };

    public addBooking = async (sessionId: string, userId: string): Promise<IDbSession> => {
        const result = await this._functions.httpsCallable('addBooking')({ sessionId, userId });
        return result.data;
    };

    public cancelBooking = async (sessionId: string, userId: string, email?: string): Promise<IDbSession> => {
        const result = await this._functions.httpsCallable('cancelBooking')({ sessionId, userId, email });
        return result.data;
    };

    public generateAccessCode = async (sessionId: string, userId: string): Promise<IDbSession> => {
        const result = await this._functions.httpsCallable('generateAccessCode')({ sessionId, userId });
        return result.data;
    };
}
