import React, { useEffect } from 'react';
import './Game.scss';
import { Redirect } from 'react-router-dom';
import socket from '../../config/socket';
//contexts
import { useGameContext } from '../../contexts/GameContext';
//components
import CountDown from '../../components/CountDown/CountDown';
import StartButton from '../../components/StartButton/StartButton';

//helper
const findPlayer = (players) => {
    return players.find((player) => player.socketID === socket.id);
};

const Game = () => {
    const { resetGameState, gameState } = useGameContext();
    const { players, _id: gameID, isOver } = gameState;
    const player = findPlayer(players);
    //reset game state when player leaves the game
    useEffect(() => {
        return () => {
            resetGameState();
        };
    }, [resetGameState, gameID]);

    //redirect if user didn't submit create or join form
    if (!gameID) {
        return <Redirect to="/" />;
    }
    return (
        <section className="mt-5 p-5">
            <div className="player-area">
                {
                    //if game has started display game stats
                    gameState.isOpen ? null : (
                        <div className="stats">
                            <CountDown />
                            {player.WPM >= 0 ? <h3>{player.WPM} WPM</h3> : null}
                        </div>
                    )
                }
                <StartButton player={player} gameID={gameID} isGameOver={isOver} />
            </div>
        </section>
    );
};

export default Game;
