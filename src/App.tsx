import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { AppHeader } from './components/AppHeader';
import { Registration } from './components/Registration';
import { UserSessions } from './components/UserSessions';
import { FirebaseContext } from './contexts/FirebaseContext';
import { Loader } from './components/Loader';
import { FirebaseService } from './services/FireBaseService';

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [firebaseService, setFirebaseService] = useState<FirebaseService>();

    const fetchConfig = async () => {
        // Dynamically load firebase config
        // from: https://firebase.google.com/docs/hosting/reserved-urls
        const result = await fetch('/__/firebase/init.json');
        return result.json();
    };

    useEffect(() => {
        fetchConfig().then(config => {
            firebase.initializeApp(config);
            setFirebaseService(new FirebaseService(firebase.functions()));
            setLoading(false);
        });
    }, []);

    return (
        <div className="App">
            <Router>
                <AppHeader />
                <Loader loading={loading} />
                {!loading && (
                    <FirebaseContext.Provider value={firebaseService}>
                        <Switch>
                            <Route path="/" exact component={Registration} />
                            <Route path="/:userId" exact component={UserSessions} />
                        </Switch>
                    </FirebaseContext.Provider>
                )}
            </Router>
        </div>
    );
};

export default App;
