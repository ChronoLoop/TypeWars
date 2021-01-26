import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

//components
import ScrollTop from '../components/ScrollTop/ScrollTop';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import ErrorModal from '../components/ErrorModal/ErrorModal';
//pages
import Home from '../pages/Home/Home';
import CreateGame from '../pages/CreateGame/CreateGame';
import JoinGame from '../pages/JoinGame/JoinGame';
import Game from '../pages/Game/Game';

const App = () => {
    return (
        <div className="background-container">
            <ScrollTop />
            <Navbar />
            <ErrorModal />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/game/create" component={CreateGame} />
                <Route exact path="/game/join" component={JoinGame} />
                <Route exact path="/game/:id" component={Game} />
                <Redirect to="/" />
            </Switch>
            <Footer />
        </div>
    );
};

export default App;
