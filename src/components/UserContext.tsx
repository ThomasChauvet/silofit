import React, { useState, useEffect } from 'react';
import { IUser } from '../models/User';
import { RouteComponentProps } from 'react-router-dom';

const UserContext = React.createContext<IUser | null>(null);

export const UserContextProvider = UserContext.Provider;

export const UserContextConsumer = UserContext.Consumer;

interface IProps extends RouteComponentProps<{ userId?: string }> {
    children?: React.ReactNode;
}

export const UserProvider = (props: IProps) => {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        fetchUser();
    });
    const fetchUser = async () => {
        if (props.match.params.userId) {
            setUser({ key: props.match.params.userId, email: 'test@gmail.com' });
        }
    };

    return <UserContextProvider value={user}>{props.children}</UserContextProvider>;
};
