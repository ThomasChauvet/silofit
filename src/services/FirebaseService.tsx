import * as firebase from 'firebase';

// TODO: Put this in a react context so that all components can share the same firebase App
export const fetchConfig = async () => {
    // Dynamically load firebase config
    // from: https://firebase.google.com/docs/hosting/reserved-urls
    const result = await fetch('/__/firebase/init.json');
    return result.json();
};

export const callFirebaseFunction = async (funcName: string, data: { [key: string]: any }) => {
    // TODO: Fixme, this is dead ugly
    // Cannot get react contexts to work at the moment, so a connection is initialized for each component where necessary
    try {
        // Init firebase app if necessary
        if (firebase.apps.length === 0) {
            const config = await fetchConfig();
            firebase.initializeApp(config);
        }
    } catch (e) {
        // Do nothing
    }
    const result = await firebase.functions().httpsCallable(funcName)(data);
    return result.data;
};
