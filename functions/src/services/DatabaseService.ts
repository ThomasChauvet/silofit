import { IDbDomain, IDomain } from '../models/Domain';
import { IUser, IDbUser } from '../models/User';
import { appDB } from './FirebaseService';
import { ISlot } from '../models/Slot';
import EmailUtils from '../utils/EmailUtils';

export const DOMAINS_REF = 'domains';
export const USERS_REF = 'users';
export const SESSIONS_REF = 'sessions';

class DatabaseService {
    private getKeyValueObject = <T>(snapshotValue: any): { key: string; value: T } => {
        const key = Object.getOwnPropertyNames(snapshotValue)[0];
        return {
            key,
            value: snapshotValue[key] as T,
        };
    };

    public getDomainFromName = async (domainName: string): Promise<IDbDomain | null> => {
        let domain: IDbDomain | null = null;
        await appDB
            .ref(DOMAINS_REF)
            .orderByChild('domain')
            .equalTo(domainName)
            .limitToFirst(1)
            .once('value', snapshot => {
                if (snapshot.exists()) {
                    console.log(`Domain ${domainName} found`);
                    domain = this.getKeyValueObject<IDomain>(snapshot.val());
                    console.log(`Domain ${domainName} found: ${domain}`);
                } else {
                    console.log(`Domain ${domainName} not found`);
                }
            });
        return domain;
    };

    public addDomain = async (domain: IDomain): Promise<string> => {
        const entry = await appDB.ref(DOMAINS_REF).push(domain);
        return entry.key as string;
    };

    public getDomainFromUserKey = async (userKey: string): Promise<IDbDomain | null> => {
        // Fetch user to get domain from email address
        const dbUser = await this.getUserByKey(userKey);
        // User not found? Nothing to return
        if (!dbUser) {
            return null;
        }

        return await this.getDomainFromName(EmailUtils.getDomain(dbUser.value.email));
    };

    public addSlot = async (domainKey: string, slot: ISlot): Promise<string> => {
        console.log(`Adding slot ${slot} to domain ${domainKey}`);
        const entry = await appDB
            .ref(DOMAINS_REF)
            .child(domainKey)
            .child('slots')
            .push(slot);
        return entry.key as string;
    };

    public getUserByEmail = async (email: string): Promise<IDbUser | null> => {
        let user: IDbUser | null = null;

        await appDB
            .ref(USERS_REF)
            .orderByChild('email')
            .equalTo(email)
            .limitToFirst(1)
            .once('value', snapshot => {
                if (snapshot.exists()) {
                    user = this.getKeyValueObject<IUser>(snapshot.val());
                }
            });

        return user;
    };

    public getUserByKey = async (userKey: string): Promise<IDbUser | null> => {
        let user: IDbUser | null = null;

        await appDB
            .ref(USERS_REF)
            .orderByKey()
            .equalTo(userKey)
            .limitToFirst(1)
            .once('value', snapshot => {
                if (snapshot.exists()) {
                    user = this.getKeyValueObject<IUser>(snapshot.val());
                }
            });

        return user;
    };

    public addUser = async (user: IUser): Promise<string> => {
        const entry = await appDB.ref(USERS_REF).push(user);
        return entry.key as string;
    };
}

const databaseService = new DatabaseService();

export default databaseService;
