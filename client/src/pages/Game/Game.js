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
import GameWords from '../../components/GameWords/GameWords';
import PlayersProgress from '../../components/PlayersProgress/PlayersProgress';
import ScoreBoard from '../../components/ScoreBoard/ScoreBoard';
import RestartButton from '../../components/RestartButton/RestartButton';
//helper
const findPlayer = (players) => {
    return players.find((player) => player.socketID === socket.id);
};

const Game = () => {
    const { resetGameState, gameState } = useGameContext();
    const { players, _id: gameID, isOver, isOpen, words } = gameState;
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
        <section className="game-page">
            <div className="game">
                <PlayersProgress players={players} player={player} wordsLength={words.length} />
                <div className="player-area">
                    <div className="stats">
                        <CountDown isGameOver={isOver} />
                        {player && player.WPM >= 0 ? <h3>{player.WPM} WPM</h3> : <h3>0 WPM</h3>}
                    </div>
                    <GameWords words={words} player={player} />
                    <GameInput
                        isGameOver={isOver}
                        isGameOpen={isOpen}
                        gameID={gameID}
                        finishedTyping={player.finishedTyping}
                    />
                    <div className="d-flex justify-content-center flex-wrap mt-4">
                        <StartButton
                            player={player}
                            gameID={gameID}
                            isGameOver={isOver}
                            className="mr-2"
                        />
                        <RestartButton player={player} gameID={gameID} isGameOver={isOver} />
                    </div>
                </div>
                {isOpen ? <GameCode gameID={gameID} /> : null}
                <ScoreBoard players={players} />
            </div>
        </section>
    );
};

export default Game;
