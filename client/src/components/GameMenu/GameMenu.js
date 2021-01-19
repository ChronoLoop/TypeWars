import React from 'react';
import './GameMenu.scss';
import { Button } from 'react-bootstrap';
//image
import LogoImage from '../../assets/img/logo.svg';
import { useHistory } from 'react-router-dom';

const GameMenu = () => {
    const history = useHistory();

    const onClickCreateGame = () => {
        history.push('/game/create');
    };
    const onClickJoinGame = () => {
        history.push('/game/join');
    };

    return (
        <div className="game-menu text-center mt-5">
            <h1>Welcome to {'<TypeWars/>'}</h1>
            <img src={LogoImage} alt={'Keyboard logo'} />
            <p>An online multiplayer typing game</p>
            <div className="buttons-container">
                <Button
                    size="lg"
                    variant="primary"
                    onClick={onClickCreateGame}
                    className="mb-2"
                    block
                >
                    Create Game
                </Button>
                <Button size="lg" variant="secondary" onClick={onClickJoinGame} block>
                    Join Game
                </Button>
            </div>
        </div>
    );
};

export default GameMenu;
