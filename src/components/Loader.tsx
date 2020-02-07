import React from 'react';
import { RingLoader } from 'react-spinners';

interface ILoaderProps {
    loading: boolean;
}

export const Loader: React.FC<ILoaderProps> = props => {
    return <RingLoader css={'margin: 1em auto;'} size={60} color={'#ce9b6c'} loading={props.loading} />;
};
