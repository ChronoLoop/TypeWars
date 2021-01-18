import React from 'react';
import './GameMenu.scss';
import { Button } from 'react-bootstrap';
//image
import LogoImage from '../../assets/img/logo.svg';
import { useHistory } from 'react-router-dom';

const GameMenu = () => {
    const history = useHistory();

    const handleCreateGame = () => {
        history.push('/game/create');
    };
    const handleJoinGame = () => {
        history.push('/game/join');
    };

    return (
        <section className="game-menu text-center">
            <h1>Welcome to {'<TypeWars/>'}</h1>
            <img src={LogoImage} alt={'Keyboard logo'} />
            <p>An online multiplayer typing game</p>
            <div className="buttons-container">
                <Button
                    size="lg"
                    variant="primary"
                    onClick={handleCreateGame}
                    className="mb-2"
                    block
                >
                    Create Game
                </Button>
                <Button size="lg" variant="secondary" onClick={handleJoinGame} block>
                    Join Game
                </Button>
            </div>
        </section>
    );
};

export default GameMenu;
