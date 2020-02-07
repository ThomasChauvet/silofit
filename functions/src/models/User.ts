export interface IUser {
    email: string;
    isAdmin: boolean;
}

export interface IDbUser {
    key: string;
    value: IUser;
}
