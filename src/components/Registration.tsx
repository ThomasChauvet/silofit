import React, { useState } from 'react';
import { callFirebaseFunction } from '../services/FirebaseService';
import { RingLoader } from 'react-spinners';
import EmailUtils from '../utils/EmailUtils';

export const Registration: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<String>('');
    const [link, setLink] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Handles form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        if (validateForm()) {
            await submitForm();
        }
    };

    /**
     * Executes the validation rules for all the fields on the form and sets the error state
     * @returns {boolean} - Whether the form is valid or not
     */
    const validateForm = (): boolean => {
        if (!email || email.trim() === '') {
            setError('Email is mandatory');
        } else if (!EmailUtils.isEmailValid(email)) {
            setError('Email is invalid');
        }
        return error === '';
    };

    /**
     * Submits the form to the http api
     * @returns {boolean} - Whether the form submission was successful or not
     */
    const submitForm = async (): Promise<boolean> => {
        try {
            setLoading(true);
            setLink(await callFirebaseFunction('generateLink', email));
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
            <div>Please enter your work email address and we'll send you an email to book seessions at Silofit</div>
            <input name="email" value={email} type="email" onChange={onUpdateEmail} disabled={loading}></input>
            <button disabled={loading}>Send me my access link</button>
            <RingLoader css={'margin: 1em auto;'} size={60} color={'#ce9b6c'} loading={loading} />
            {link && (
                <div className="alert alert-info" role="alert">
                    The link was successfully generated: {link}
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
