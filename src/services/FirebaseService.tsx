import * as firebase from 'firebase';

// TODO: Put this in a react context so that all components can share the same firebase App
export const fetchConfig = async () => {
    // Dynamically load firebase config
    // from: https://firebase.google.com/docs/hosting/reserved-urls
    const result = await fetch('/__/firebase/init.json');
    return result.json();
};

export const callFirebaseFunction = async (funcName: string, ...funcArgs: any[]) => {
    // Init firebase app if necessary
    if (firebase.apps.length === 0) {
        const config = await fetchConfig();
        firebase.initializeApp(config);
    }
    firebase.functions().useFunctionsEmulator('http://localhost:5001');
    const result = await firebase.functions().httpsCallable(funcName)(...funcArgs);
    console.log(result);
    return result.data;
};
