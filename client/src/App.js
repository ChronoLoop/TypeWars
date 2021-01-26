import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/styles.scss';

//routes
import Routes from './Routes/routes';
//context
import { GameProvider } from './contexts/GameContext';
import { ErrorProvider } from './contexts/ErrorContext';

const App = () => {
    return (
        <Router>
            <ErrorProvider>
                <GameProvider>
                    <Routes />
                </GameProvider>
            </ErrorProvider>
        </Router>
    );
};

export default App;
