import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { AppHeader } from './components/AppHeader';
import { Registration } from './components/Registration';
import { Sessions } from './components/Sessions';

const App: React.FC = () => {
    return (
        <div className="App">
            <Router>
                <AppHeader />
                <Switch>
                    <Route path="/" exact component={Registration} />
                    <Route path="/:userId" exact component={Sessions} />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
