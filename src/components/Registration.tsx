import React, { useState, useContext } from 'react';
// import { callFirebaseFunction } from '../services/FirebaseService';
import { Loader } from './Loader';
import EmailUtils from '../utils/EmailUtils';
import { FirebaseContext } from '../contexts/FirebaseContext';

export const Registration: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [submitSuccess, setSubmitSuccess] = useState<Boolean>();
    const [error, setError] = useState<String>('');
    const [loading, setLoading] = useState<boolean>(false);
    const firebaseFunctions = useContext(FirebaseContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        if (validateForm()) {
            setSubmitSuccess(await submitForm());
        }
    };

    const validateForm = (): boolean => {
        if (!email || email.trim() === '') {
            setError('Email is mandatory');
        } else if (!EmailUtils.isEmailValid(email)) {
            setError('Email is invalid');
        }
        return error === '';
    };

    const submitForm = async (): Promise<boolean> => {
        try {
            setLoading(true);
            await firebaseFunctions?.httpsCallable('generateLink')({ email });
            // await callFirebaseFunction('generateLink', { email });
            setLoading(false);
            return true;
        } catch (e) {
            setError(e.message);
            setLoading(false);
            return false;
        }
    };

    const onUpdateEmail = (e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value);

    return (
        <form onSubmit={handleSubmit} noValidate={true}>
            <div>Please enter your work email address and we'll send you an email to book sessions at Silofit</div>
            <input name="email" value={email} type="email" onChange={onUpdateEmail} disabled={loading}></input>
            <button disabled={loading}>Send me my access link</button>
            <Loader loading={loading} />
            {submitSuccess && error === '' && (
                <div className="alert alert-info" role="alert">
                    An email containing the link to log into the application was sent to {email}
                </div>
            )}
            {error !== '' && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </form>
    );
};
