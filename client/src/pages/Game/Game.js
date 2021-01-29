import React, { useEffect } from 'react';
import './Game.scss';
import { Redirect } from 'react-router-dom';
import socket from '../../config/socket';
//contexts
import { useGameContext } from '../../contexts/GameContext';
//components
import CountDown from '../../components/CountDown/CountDown';
import StartButton from '../../components/StartButton/StartButton';
import GameInput from '../../components/GameInput/GameInput';
import GameCode from '../../components/GameCode/GameCode';
//helper
const findPlayer = (players) => {
    return players.find((player) => player.socketID === socket.id);
};

const Game = () => {
    const { resetGameState, gameState } = useGameContext();
    const { players, _id: gameID, isOver, isOpen } = gameState;
    const player = findPlayer(players);
    //reset game state when player leaves the game
    useEffect(() => {
        return () => {
            if (gameID) {
                socket.emit('player-left', { gameID });
            }
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
                <div className="stats">
                    <CountDown />
                    {player && player.WPM >= 0 ? <h3>{player.WPM} WPM</h3> : <h3>0 WPM</h3>}
                </div>
                <span className="my-2">{gameState.words.join(' ')}</span>
                <GameInput
                    isGameOver={isOver}
                    isGameOpen={isOpen}
                    gameID={gameID}
                    finishedTyping={player.finishedTyping}
                />
                <StartButton player={player} gameID={gameID} isGameOver={isOver} />
            </div>
            {isOpen ? <GameCode gameID={gameID} /> : null}
        </section>
    );
};

export default Game;
