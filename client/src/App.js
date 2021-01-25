import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './styles/styles.scss';

//components
import ScrollTop from './components/ScrollTop/ScrollTop';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
//pages
import Home from './pages/Home/Home';
import CreateGame from './pages/CreateGame/CreateGame';
import JoinGame from './pages/JoinGame/JoinGame';

const App = () => {
    return (
        <Router>
            <div className="background-container">
                <ScrollTop />
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/game/create" component={CreateGame} />
                    <Route exact path="/game/join" component={JoinGame} />
                    <Redirect to="/" />
                </Switch>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
