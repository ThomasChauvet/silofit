import React, { useState } from 'react';
import * as firebase from 'firebase';

export interface IErrors {
    /* The validation error messages for each field (key is the field name) */
    [key: string]: string;
}

export const Registration: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [errors, setErrors] = useState<IErrors>({});
    const [submitSuccess, setSubmitSuccess] = useState<Boolean>();
    const [link, setLink] = useState<string>();

    /**
     * Handles form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (validateForm()) {
            const submitSuccess: boolean = await submitForm();
            setSubmitSuccess(submitSuccess);
        }
    };

    /**
     * Executes the validation rules for all the fields on the form and sets the error state
     * @returns {boolean} - Whether the form is valid or not
     */
    const validateForm = (): boolean => {
        // TODO - validate form
        setErrors({});
        return true;
    };

    /**
     * Returns whether there are any errors in the errors object that is passed in
     * @param {IErrors} errors - The field errors
     */
    const haveErrors = (): boolean => {
        Object.keys(errors).map((key: string) => {
            if (errors[key].length > 0) {
                return true;
            }
        });
        return false;
    };

    /**
     * Submits the form to the http api
     * @returns {boolean} - Whether the form submission was successful or not
     */
    const submitForm = async (): Promise<boolean> => {
        try {
            firebase
                .functions()
                .httpsCallable('generateLink')(email)
                .then(result => setLink(result.data));
            return true;
        } catch (e) {
            return false;
        }
    };

    const onUpdateEmail = (e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value);

    return (
        <form onSubmit={handleSubmit} noValidate={true}>
            <div>Please enter your work email address and we'll send you an email to book seessions at Silofit</div>
            <input name="email" value={email} type="email" onChange={onUpdateEmail}></input>
            <button>Send me my access link</button>
            {submitSuccess && (
                <div className="alert alert-info" role="alert">
                    The link was successfully generated: {link}
                </div>
            )}
            {submitSuccess === false && !haveErrors() && (
                <div className="alert alert-danger" role="alert">
                    Sorry, an unexpected error has occurred
                </div>
            )}
            {submitSuccess === false && haveErrors() && (
                <div className="alert alert-danger" role="alert">
                    Sorry, the form is invalid. Please review, adjust and try again
                </div>
            )}
        </form>
    );
};
